const fs = require('fs');
const path = require('path');
const { waitForStableUI } = require("./WaitUtils.js");

function _ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function _sanitize(str) {
    return str
        .replace(/[<>:"/\\|?*]+/g, '')     // forbidden filename chars
        .replace(/\s+/g, '_')              // spaces → _
        .substring(0, 60);                 // safety limit
}

/**
 * Saves screenshot into:
 * projectRoot/screenshots/YYYY-MM-DD/HH-mm-ss_suite_test.png
 */
async function saveScreenshot(driver, mochaContext) {
    try {
        await waitForStableUI(driver);
        const test = mochaContext.currentTest;
        const now = new Date();
        const dateFolder = now.toISOString().slice(0, 10);               // YYYY-MM-DD
        const timeStamp = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // HH-mm-ss

        // suite = test file name (without .js)
        const rawPath = test.file || '';
        const rawFile = rawPath.split(/[\\/]/).pop() || 'suite.js';
        const suite = _sanitize(rawFile.replace('.js', ''));

        // test name from it() block
        const rawTestName = test.title || 'test';
        const testName = _sanitize(rawTestName);

        // Final filename
        const finalFile = `${timeStamp}_${suite}_${testName}.png`;

        // Full path
        const screenshotsRoot = path.join(process.cwd(), 'screenshots');
        const dateDir = path.join(screenshotsRoot, dateFolder);
        _ensureDir(dateDir);
        const filePath = path.join(dateDir, finalFile);

        // Take WebDriver screenshot
        const image = await driver.takeScreenshot();
        fs.writeFileSync(filePath, image, 'base64');
        console.log(`Screenshot saved: ${filePath}`);

    } catch (err) {
        console.warn('⚠️ Failed to capture screenshot:', err.message);
    }
}

module.exports = { saveScreenshot };