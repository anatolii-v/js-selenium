const HomePage = require("../pages/HomePage.js");
const AuthenticatedPage = require("../pages/book_store/AuthenticatedPage.js");
const { createDriver, quitDriver } = require("../utils/DriverUtils.js");
const { saveScreenshot } = require("../utils/ScreenshotUtils.js");
const { By, until } = require("selenium-webdriver");

let driver;
let url = process.env.DEMOQA_BASE_URL || 'https://demoqa.com/';
let homePage;

before(async function() {
    driver = await createDriver();
    if (process.env.CI !== 'true') {
        await driver.manage().window().maximize();
    }
    this.driver = driver;
});

async function debugHomePageState() {
    try {
        const currentUrl = await driver.getCurrentUrl();
        const title = await driver.getTitle();
        // Basic diagnostics for CI logs
        console.log('DEBUG: currentUrl =', currentUrl);
        console.log('DEBUG: title =', title);
    } catch (err) {
        console.warn('DEBUG: failed to get page state', err);
    }
}

async function navigateHomeWithRetry(maxAttempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await driver.get(url);
            // wait for page to fully load before handing it to the test
            await driver.wait(
                until.elementLocated(By.css('.home-banner')),
                process.env.CI === 'true' ? 30000 : 10000
            );

            if (process.env.CI === 'true') {
                const elementsCard = await driver.findElements({
                    xpath: "//div[@id='app']//h5[text()='Elements']"
                });
                if (!elementsCard.length) {
                    await debugHomePageState();
                    throw new Error('Elements card not found on home page');
                }
            }

            return;
        } catch (err) {
            lastError = err;
            if (attempt === maxAttempts) {
                console.error('navigateHomeWithRetry failed after attempts:', attempt, lastError);
                throw lastError;
            }
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

beforeEach(async function() {
    await navigateHomeWithRetry();
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