const BasePage = require("./BasePage.js");
const MainMenu = require("../components/MainMenu.js");
const { getPageByMenuItem } = require("../utils/PageFactoryUtils.js");

class WidgetsPage extends BasePage 
{
    constructor(driver) {
    super(driver);
    this.menu=new MainMenu(driver);
        this.cardName="Widgets";
        this.itemNames=['Accordion', 'Auto Complete', 'Date Picker'];
        this.infoText= { xpath: "//div[@class='col-12 mt-4 col-md-6']"};
    }
    async getWidgetsPageText() {
        return await this._getText(this.infoText);
    }
    async gotoDatePickerMenuItem() {
        await this.menu.clickMenuItem(this.cardName, this.itemNames[2]);
        return getPageByMenuItem(this.driver, this.itemNames[2]);
    }
}

module.exports = WidgetsPage;