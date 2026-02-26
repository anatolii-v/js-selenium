const BasePage = require("./BasePage.js");
const MainMenu = require("../components/MainMenu.js");
const { getPageByMenuItem } = require("../utils/PageFactoryUtils.js");

class InteractionsPage extends BasePage 
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.cardName="Interactions";
        this.itemNames=['Sortable', 'Selectable', 'Resizable', 'Droppable', 'Dragabble'];
        this.infoText= { xpath: "//div[@class='col-12 mt-4 col-md-6']"};
    }

    async getInteractionsPageText() {
        return await this._getText(this.infoText);
    }

    async gotoSortableMenuItem() {
        await this.menu.clickMenuItem(this.cardName, this.itemNames[0]);
        return getPageByMenuItem(this.driver, this.itemNames[0]);
    }
    async gotoDroppableMenuItem() {
        await this.menu.clickMenuItem(this.cardName, this.itemNames[3]);
        return getPageByMenuItem(this.driver, this.itemNames[3]);
    }
}

module.exports = InteractionsPage;