const HomePage = require("../pages/HomePage.js");
const AuthenticatedPage = require("../pages/book_store/AuthenticatedPage.js");
const { createDriver, quitDriver } = require("../utils/DriverUtils.js");
const { saveScreenshot } = require("../utils/ScreenshotUtils.js");
const { By, until } = require("selenium-webdriver");

let driver;
let url = 'https://demoqa.com/';
let homePage;

before(async function() {
    driver = await createDriver();
    if (process.env.CI !== 'true') {
        await driver.manage().window().maximize();
    }
    this.driver = driver;
});

beforeEach(async function() {
    await driver.get(url);
    // wait for page to fully load before handing it to the test
    await driver.wait(
        until.elementLocated(By.css('.home-banner')),
        process.env.CI === 'true' ? 30000 : 10000
    );
    homePage = new HomePage(driver);
    this.homePage = homePage;
});

afterEach(async function () {
    if (this.currentTest.state === 'failed') {
        await saveScreenshot(driver, this);
    }
});

afterEach(async function () {
    if (this.currentTest.ctx.authSucceeded === true) {
        const userPage = new AuthenticatedPage(driver);
        await userPage.clickLogoutButton();
    }
});

after(async function() {
    await quitDriver();
});

function getHomePage() {
    return homePage;
}

module.exports = { getHomePage };