const BasePage = require("../BasePage.js");
const { waitVisible }= require("../../utils/WaitUtils.js");

class AuthenticatedPage extends BasePage
{
  constructor(driver) {
    super(driver);
    this.buttonsTag= "//button[text()='";
    this.logoutButtonText= "Log out";
    this.userNameLabel = { id: "userName-label" };
    this.userNameValue = { id: "userName-value" };
  }
  _getLogoutButtonLocator(){
      return { xpath: `${this.buttonsTag}${this.logoutButtonText}']`};
  }
  async waitUserPageReady(){
    const locator= await this._getLogoutButtonLocator();
    await waitVisible(this.driver, locator);
  }
  async clickLogoutButton(){
    const locator= await this._getLogoutButtonLocator();
    await waitVisible(this.driver, locator);
    await this._click(locator);
  }
  async getUserName(){
    await this.waitUserPageReady();
    return await this._getText(this.userNameValue);
  }
  async isUserNameDisplayed(){
    return await this._isDisplayed(this.userNameValue);
  }

}
module.exports= AuthenticatedPage;