const BasePage = require("../BasePage.js");
const MainMenu = require("../../components/MainMenu.js");

class AutomationPracticeFormPage extends BasePage
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.mainHeader= "//div//h1";
        this.subHeader= "//div//h5";
    }

    async getMainHeader(){
        return await this._getText(this.mainHeader);
    }
    async getSubHeader(){
        return await this._getText(this.subHeader);
    }
}
module.exports= AutomationPracticeFormPage;