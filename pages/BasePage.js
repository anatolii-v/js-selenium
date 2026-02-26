const { scrollToElement } = require("../utils/BrowserUtils.js");
const { waitClickable } = require("../utils/WaitUtils.js");
const { Key }= require('selenium-webdriver');
class BasePage 
{
  constructor(driver){
    this.driver=driver;
  }

  async _find(locator){
    return await this.driver.findElement(locator);
  }
  async _finds(locator){
    return await this.driver.findElements(locator);
  }
  async _findInside(element, locator) {
    return await element.findElement(locator);
  }
  async _findsInside(element, locator) {
    return await element.findElements(locator);
  }

  async _isEnabled(target) {
    const element = (typeof target.getText === 'function') ? target : await this._find(target);
    return await element.isEnabled();
  }
  async _isSelected(target) {
    const element = (typeof target.getText === 'function') ? target : await this._find(target);
    return await element.isSelected(); 
  }
  async _isDisplayed(locator) {
    try {
      const element = await this._find(locator);
      return await element.isDisplayed();
    } catch (err) {
      // element not found → it's definitely not visible
      if (err.name === "NoSuchElementError") return false;
      throw err;
    }
  }

  async _click(locator) {
    let element;
    try {
      element = await waitClickable(this.driver, locator);
      await element.click();
    } catch (err) {
      if (err.name === 'ElementClickInterceptedError') {
        //console.warn(`⚠️ Click intercepted, retrying with scroll...`);
        element = await this._find(locator);
        await scrollToElement(this.driver, element);
        await element.click();
      } else {
        throw err;
      }
    }
  }
  async _clickElement(element) {
    try {
        await element.click();
    } catch (err) {
      if (err.name === 'ElementClickInterceptedError') {
        await scrollToElement(this.driver, element);
        await element.click();
      } else {
        throw err;
      }
    }
  }

  async _set(locator, text) {
    let element= await this._find(locator);
    await element.clear();
    await element.sendKeys(text);
  }
  async _backspace(locator, num) {
    const element = await this._find(locator);
    await element.sendKeys(Key.chord(...Array(num).fill(Key.BACK_SPACE)));
  }
  async _pressEscape() {
    await this.driver.actions().sendKeys(Key.ESCAPE).perform();
  }
  async _pressTab(){
    await this.driver.actions().sendKeys(Key.TAB).perform();
  }
  async _pressEnter(){
    await this.driver.actions().sendKeys(Key.ENTER).perform();
  }
  
  /** @returns {Promise<string>} */
  async _getUrl(){
    return await this.driver.getCurrentUrl();
  }
  async _getValue(element){
    return await element.getAttribute('value');
  }
  async _getClass(element){
    return await element.getAttribute('class');
  }
  async _getType(element){
    return await element.getAttribute('type');
  }
  async _getSrc(element){
    return await element.getAttribute('src');
  }
  async _getText(target) {
    let element;
    if (typeof target === 'object' && typeof target.getText === 'function') {
      // Already a WebElement
      element = target;
    } else {
      // Treat as locator
      element = await this._find(target);
    }
    return await element.getText();
  }
  async _getColorValue(locator, CSSProperty) {
    let element= await this._find(locator);
    return element.getCssValue(CSSProperty);
  }
}

module.exports = BasePage;