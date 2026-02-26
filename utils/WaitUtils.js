const { until } = require('selenium-webdriver');

const TRANSIENT_SELECTORS = [
    '.dropdown-menu.show',
    '.modal.show',
    '.spinner',
    '.tooltip.show'
];
async function waitForStableUI(driver) {
    const timeout= 10000;
    const startTime = Date.now();
    while (true) {
        const elements = await Promise.all(
            TRANSIENT_SELECTORS.map(sel => driver.findElements({ css: sel }))
        );
        const visible = elements.flat().filter(el => el);
        if (visible.length === 0) break;
        if (Date.now() - startTime > timeout) break;
        await new Promise(r => setTimeout(r, 50));
    }
    await new Promise(r => setTimeout(r, 50));
}
async function waitVisible(driver, locator) {
    const timeout= 10000;
    const element = await driver.wait(until.elementLocated(locator), timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    return element;
}
async function waitIsRemoved(driver, locator) {
    const timeout= 10000;
    try {
        const element = await driver.findElement(locator);
        await driver.wait(until.stalenessOf(element), timeout);
    } catch (err) {
        // if element is NOT found -> it's already gone, exactly what we need
        if (err.name === "NoSuchElementError") {
            return;
        }
        throw err;
    }
}
async function waitClickable(driver, locator) {
    const timeout= 10000;
    const element = await waitVisible(driver, locator);
    await driver.wait(until.elementIsEnabled(element), timeout);
    return element;
}
async function waitText(driver, locator, expectedText) {
    const timeout= 10000;
    await driver.wait(async () => {
        const element = await driver.findElement(locator);
        const text = await element.getText();
        return text.includes(expectedText);
    }, timeout, `Text "${expectedText}" not found in element`);
}

async function waitForFirstVisible(driver, successEl, failureEl) {
    return await Promise.race([
        waitVisible(driver, successEl).then(() => true),
        waitVisible(driver, failureEl).then(() => false)
    ]);
}
module.exports={ waitClickable, waitVisible, waitForStableUI, waitIsRemoved, waitForFirstVisible };

