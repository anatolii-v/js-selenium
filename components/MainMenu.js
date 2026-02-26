const BasePage = require("../pages/BasePage.js");
const { waitVisible, waitClickable, waitIsRemoved } = require("../utils/WaitUtils.js");
const { scrollToElement } = require("../utils/BrowserUtils.js");

class MainMenu extends BasePage
{
  constructor(driver) {
    super(driver);
    this.navigationBarButton= { xpath: "//button[@class='navbar-toggler']"};
    this.expandedMenuLocator= { xpath: "//div[contains(@class,'left-pannel')]"};
    this.cardMenuPrefix= "//div[contains(@class,'header-text') and text()='";
    this.cardMenuSuffix= "//ancestor::div[contains(@class,'element-group')]//div[contains(@class,'element-list')]";
    //Menu Items
    this.menuItemPrefix="//li//span[text()='";
    this.menuItemSuffix="']//ancestor::li[contains(@class, 'btn btn-light')]";
  }
  // names={'Elements', 'Forms', 'Alerts, Frame & Windows', 'Widgets', 'Interactions', 'Book Store Application'}
  _getMenuHeaderLocator(name) {
    return {xpath: `${this.cardMenuPrefix}${name}']`};
  }
  _getMenuStatusLocator(name) {
    return {xpath: `${this.cardMenuPrefix}${name}']${this.cardMenuSuffix}`};
  }
  _getMenuItemLocator(name) {
    return { xpath: `${this.menuItemPrefix}${name}']`};
  }
  _checkStateMenuItemLocator(name) {
    return { xpath: `${this.menuItemPrefix}${name}${this.menuItemSuffix}`};
  }
  async waitNavBarButton(){
    await waitVisible(this.driver, this.navigationBarButton);
    await waitClickable(this.driver, this.navigationBarButton);
  }
  async clickNavBarButton(){
    await this._click(this.navigationBarButton);
  }
  async isNavBarVisible() {
    return await this._isDisplayed(this.navigationBarButton);
  }
  async isMenuRemoved(){
    await waitIsRemoved(this.driver, this.expandedMenuLocator);
  }
  async isNavBarExpanded(){
    const expandedPanels = await this._finds(this.expandedMenuLocator);
    if (expandedPanels.length > 0) {
        return true;
    }
    return false;
  }
  async _ensureMenuVisible() {
    const isExpanded = await this.isNavBarExpanded();
    if (isExpanded) {
        return;
    }
    await this.clickNavBarButton();
    await waitVisible(this.driver, this.expandedMenuLocator);
  }

  async expandMenu(name) {
    await this._ensureMenuVisible();
    const header = this._getMenuHeaderLocator(name);
    const container = this._getMenuStatusLocator(name);
    const element = await this._find(container);
    const classValue = await this._getClass(element);

    if (!classValue.includes("show")) {
        await this._click(header);
    }
  }

  async collapseMenu(name) {
    await this._ensureMenuVisible();
    const header = this._getMenuHeaderLocator(name);
    const container = this._getMenuStatusLocator(name);

    const element = await this._find(container);
    const classValue = await this._getClass(element);

    if (classValue.includes("show")) {
        await this._click(header);
    }
  }

  async clickMenuItem(menuName, itemName) {
    await this.expandMenu(menuName);
    const item = this._getMenuItemLocator(itemName);
    await this._click(item);
  }
  async waitMenuVisible(name){
    const locator = this._getMenuStatusLocator(name);
    waitVisible(this.driver, locator);
    return await this._find(locator);
  }

  async isMenuExpanded(name){
    const element =await this.waitMenuVisible(name);
    const classValue = await this._getClass(element);
    if (!classValue.includes("show")) {
      return false;
    }
    return true;
  }
  async isSubMenuItemActive(name){
    const locator=this._checkStateMenuItemLocator(name);
    const element = await this._find(locator);
    const classValue = await this._getClass(element);
    if (classValue.includes("active")) {
      return true;
    }
    return false;
  }
  async scrollToTheHead(){
    const element=await this._find(this.navigationBarButton);
    await scrollToElement(this.driver, element);
  }
}
module.exports = MainMenu;