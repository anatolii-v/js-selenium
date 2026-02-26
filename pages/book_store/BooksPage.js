const AuthenticatedPage = require("./AuthenticatedPage.js");
const MainMenu = require("../../components/MainMenu.js");
const BooksTable = require("../../components/BooksTable.js");
const LoginPage = require("../book_store/LoginPage.js");
const { waitVisible } = require("../../utils/WaitUtils.js");
const { isInViewport } = require("../../utils/BrowserUtils.js");

class BooksPage extends AuthenticatedPage
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.booksTable= new BooksTable(driver);
        this.loginButton= { id: "login" };
    }
    async getBooksPageUrl() {
        return await this._getUrl();
    }
    async waitLoginButton(){
        await waitVisible(this.driver, this.loginButton);
    }
    async clickLoginButton(){
        await waitVisible(this.driver, this.loginButton);
        await this._click(this.loginButton);
        return new LoginPage(this.driver);
    }
    async isLoginButtonVisible(){
        const element= await this._find(this.loginButton);
        return await isInViewport(this.driver, element);
    }
    async isLoginButtonDisplayed(){
        return await this._isDisplayed(this.loginButton);
    }
    async getLabelText(){
        await this.waitUserPageReady();
        await this._getText(this.userNameLabel);
    }

}
module.exports = BooksPage;