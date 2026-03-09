const { Builder } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');

let driver;

async function createDriver() {
  if (!driver) {
    const options = new chrome.Options();

    if (process.env.CI === 'true') {
      options.addArguments(
        '--headless=new',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080'
      );
      // CI: let Selenium find chromedriver automatically
      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
    } else {
      // Local: use chromedriver from npm package
      const chromedriver = require('chromedriver');
      const service = new chrome.ServiceBuilder(chromedriver.path);
      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .setChromeService(service)
        .build();
    }
  }
  return driver;
}

async function quitDriver() {
  if (driver) {
    await driver.quit();
    driver = null;
  }
}

module.exports = { createDriver, quitDriver };