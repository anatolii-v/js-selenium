async function scrollToElement(driver, element) {
  await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
}
async function scrollRelatively(driver, dx, dy){
  await driver.executeScript(`window.scrollBy(${dx}, ${dy});`);
}

async function clickElement(driver, element){
  await driver.executeScript("arguments[0].click();", element); // fallback
}

async function isInViewport(driver, element) {
    try {
        return await driver.executeScript(el => {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }, element);
    } catch (err) {
        if (err.name === "NoSuchElementError") return false;
        throw err;
    }
}

async function getDirectText(driver, locator) {
  const element = await driver.findElement(locator);
  return driver.executeScript("return arguments[0].childNodes[0].nodeValue;", element);
}

async function isInputValid(driver, element) {
  return driver.executeScript("return arguments[0].checkValidity();", element);
}

async function refreshPage(driver) {
  await driver.navigate().refresh();
}

module.exports = { scrollToElement, getDirectText, isInputValid, scrollRelatively, isInViewport, refreshPage };