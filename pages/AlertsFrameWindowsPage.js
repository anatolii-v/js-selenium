const BasePage = require("./BasePage.js");
const MainMenu = require("../components/MainMenu.js");
const { getPageByMenuItem } = require("../utils/PageFactoryUtils.js");

class AlertsFrameWindowsPage extends BasePage 
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.cardName= "Alerts, Frame & Windows"
        this.itemNames=['Browser Windows', 'Alerts', 'Frames', 'Nested Frames', 'Modal Dialogs'];
        this.infoText= { xpath: "//div[@class='col-12 mt-4 col-md-6']"};
    }

    async getAlertsFrameWindowsPageText() {
        return await this._getText(this.infoText);
    }
    async gotoBrowserWindowsMenuItem() {
        await this.menu.clickMenuItem(this.cardName, this.itemNames[0]);
        return getPageByMenuItem(this.driver, this.itemNames[0]);
    }

}

module.exports = AlertsFrameWindowsPage;