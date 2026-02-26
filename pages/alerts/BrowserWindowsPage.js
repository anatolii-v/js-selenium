const BasePage = require("../BasePage.js");
const MainMenu = require("../../components/MainMenu.js");

class BrowserWindowsPage extends BasePage
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.mainHeader= { xpath: "//div//h1"};
        this.tabButton= { id: "tabButton"};
        this.windowButton= { id: "windowButton"};
        this.messageWindowButton= { id: "messageWindowButton"};
    }
    async getMainHeader(){
        return await this._getText(this.mainHeader);
    }
    async clickTabButton(){
        await this._click(this.tabButton);
    }
    async clickWindowButton(){
        await this._click(this.windowButton);
    }
    async clickMessageWindowButton(){
        await this._click(this.messageWindowButton);
    }

}
module.exports= BrowserWindowsPage;