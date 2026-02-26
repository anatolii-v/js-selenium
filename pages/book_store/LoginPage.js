const BasePage = require("../BasePage.js");
const MainMenu = require("../../components/MainMenu.js");
const { waitVisible, waitForFirstVisible } = require("../../utils/WaitUtils.js");
const { isInputValid } = require("../../utils/BrowserUtils.js");

class LoginPage extends BasePage
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.mainHeader= { xpath: "//div//h1"};
        this.welcomeMessage= { xpath: "//form//h2//parent::div" };
        this.alreadyLoggedInMessage= { id: "loading-label"};
        this.profileLink= {  xpath: "//label[@id='loading-label']//a"};
        this.userNameField= { id: "userName"};
        this.passwordField= { id: "password"};
        this.loginButton= { id: "login"};
        this.newUserButton= { id: "newUser"};
        this.errorMessage= { id: "name" };
        this.authButton= { id: "submit"};
        
    }
    async getLoginPageUrl() {
        return await this._getUrl();
    }
    async waitUserPageReady(){
        await waitVisible(this.driver, this.authButton);
    }
    async waitNotLoggedInState(){
        await waitVisible(this.driver, this.userNameField);
        await waitVisible(this.driver, this.passwordField);
        await waitVisible(this.driver, this.loginButton);
    }
    async getWelcomeMessage(){
        await waitVisible(this.driver, this.loginButton);
        const textLines= await this._finds(this.welcomeMessage);
        const Message= await Promise.all(textLines.map(text => this._getText(text)));
        //console.log (Message);
        return Message.join(' ').replace(/\s+/g, ' ').trim();
    }
    async getAlreadyLoggedInMessage(){
        await this.waitUserPageReady();
        return await this._getText(this.alreadyLoggedInMessage);
    }
    async goToProfileFromAlreadyLoggedInMessage() {
        await this.waitUserPageReady();
        await this._click(this.profileLink);
    }
    async getErrorMessage(){
        await waitVisible(this.driver, this.errorMessage);
        return await this._getText(this.errorMessage);
    }
    async clickLoginButton(){
        await this._click(this.loginButton);
    }
    async typeUsername(randomString){
        await this._set(this.userNameField, randomString);
    }
    async typePassword(randomString){
        await this._set(this.passwordField, randomString);
    }
    async inputCredentials(username, password){
        await this.typeUsername(username);
        await this.typePassword(password);
        await this.clickLoginButton();
    }
    async loginWithKeyboard(username, password){
        await this.typeUsername(username);
        await this.typePassword(password);
        await this._pressTab();
        await this._pressEnter();
    }
    async getUsernameValidity(){
        const element= await this._find(this.userNameField);
        const isValid= await isInputValid(this.driver, element);
        return isValid;
    }
    async getPasswordValidity(){
        const element= await this._find(this.passwordField);
        const isValid= await isInputValid(this.driver, element);
        return isValid;
    }
    async isErrorMessageDisplayed(){
        const isDisplayed= await this._isDisplayed(this.errorMessage);
        return isDisplayed;
    }
    async isLoginPageInAuthState(){
        const isDisplayed= await this._isDisplayed(this.authButton);
        return isDisplayed;
    }
    async clickNewUserButton(){
        await this._click(this.newUserButton);
    }
    async verifyErrorMessageColor(){
        await waitVisible(this.driver, this.errorMessage);
        return await this._getColorValue(this.errorMessage, 'color');
    }
    // Returns true if auth failed (user stayed on LoginPage)
    async isLoginInFailed(){
        return await waitForFirstVisible(this.driver, this.loginButton, this.authButton);
    }
    async isPasswordMasked() {
        const element = await this._find(this.passwordField);
        const passwordType = await this._getType(element);
        return  passwordType === "password";
    }
}
module.exports= LoginPage;