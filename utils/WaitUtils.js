const { until } = require('selenium-webdriver');

const TIMEOUT = process.env.CI === 'true' ? 30000 : 10000; // 30s on CI, 10s local

const TRANSIENT_SELECTORS = [
    '.dropdown-menu.show',
    '.modal.show',
    '.spinner',
    '.tooltip.show'
];

async function waitForStableUI(driver) {
    const startTime = Date.now();
    while (true) {
        const elements = await Promise.all(
            TRANSIENT_SELECTORS.map(sel => driver.findElements({ css: sel }))
        );
        const visible = elements.flat().filter(el => el);
        if (visible.length === 0) break;
        if (Date.now() - startTime > TIMEOUT) break;
        await new Promise(r => setTimeout(r, 50));
    }
    await new Promise(r => setTimeout(r, 50));
}

async function waitVisible(driver, locator) {
    const element = await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.wait(until.elementIsVisible(element), TIMEOUT);
    return element;
}

async function waitIsRemoved(driver, locator) {
    try {
        const element = await driver.findElement(locator);
        await driver.wait(until.stalenessOf(element), TIMEOUT);
    } catch (err) {
        if (err.name === "NoSuchElementError") return;
        throw err;
    }
}

async function waitClickable(driver, locator) {
    const element = await waitVisible(driver, locator);
    await driver.wait(until.elementIsEnabled(element), TIMEOUT);
    return element;
}

async function waitText(driver, locator, expectedText) {
    await driver.wait(async () => {
        const element = await driver.findElement(locator);
        const text = await element.getText();
        return text.includes(expectedText);
    }, TIMEOUT, `Text "${expectedText}" not found in element`);
}

async function waitForFirstVisible(driver, successEl, failureEl) {
    return await Promise.race([
        waitVisible(driver, successEl).then(() => true),
        waitVisible(driver, failureEl).then(() => false)
    ]);
}

module.exports = { waitClickable, waitVisible, waitForStableUI, waitIsRemoved, waitForFirstVisible };