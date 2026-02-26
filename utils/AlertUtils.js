const { until } = require('selenium-webdriver');

async function waitForAlert(driver, timeout = 5000) {
    await driver.wait(until.alertIsPresent(), timeout);
}

async function getAlertText(driver) {
    await waitForAlert(driver);
    const alert = await driver.switchTo().alert();
    return await alert.getText();
}

async function acceptAlert(driver) {
    await waitForAlert(driver);
    const alert = await driver.switchTo().alert();
    await alert.accept();
}

module.exports = { getAlertText, acceptAlert };