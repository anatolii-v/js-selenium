const BasePage = require("./BasePage.js");
const MainMenu = require("../components/MainMenu.js");
const AutomationPracticeFormPage= require("./forms/AutomationPracticeFormPage.js");

class FormsPage extends BasePage 
{
    constructor(driver) {
    super(driver);
    this.menu= new MainMenu(driver);
    this.cardName="Forms";
    this.itemName="Practice Form";
    this.infoText= { xpath: "//div[@class='col-12 mt-4 col-md-6']"};
    }
    
    async getFormsPageText() {
        return await this._getText(this.infoText);
    }

    async gotoPracticeFormMenuItem() {
        await this.menu.clickMenuItem(this.cardName, this.itemName);
        return new AutomationPracticeFormPage(this.driver);
    }
}
module.exports = FormsPage;