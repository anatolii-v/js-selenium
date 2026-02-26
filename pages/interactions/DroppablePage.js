const BasePage = require("../BasePage.js");
const MainMenu = require("../../components/MainMenu.js");

class DroppablePage extends BasePage
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.mainHeader= "//div//h1";
        this.idTabMenuPreffix="droppableExample-tab-";
        this.tabMenuItems= {
            simple:             { name: 'Simple'},
            accept:             { name: 'Accept'},
            preventPropogation: { name: 'Prevent Propogation'},
            revertable:         { name: 'Revert Draggable'}
        };
        this.names = Object.values(this.tabMenuItems).map(f => f.name);
        this.keys = Object.keys(this.tabMenuItems);
    }
    _getTabMenuLocator(key){
        return {id: `${this.idTabMenuPreffix}${key}`};
    }
    async getMainHeader(){
        return await this._getText(this.mainHeader);
    }

}
module.exports= DroppablePage;