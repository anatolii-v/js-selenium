const BasePage = require("../BasePage.js");
const MainMenu = require("../../components/MainMenu.js");
const { capitalizeFirstLetter }= require("../../utils/StringUtils.js");

class SortablePage extends BasePage
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.mainHeader= "//div//h1";
        this.idTabMenuPreffix="demo-tab-";
        this.keys= ['list', 'grid'];
        this.tabMenuItems = this.keys.map(key => capitalizeFirstLetter(key));
    }
    _getTabMenuLocator(key){
        return {id: `${this.idTabMenuPreffix}${key}`};
    }
    async getMainHeader(){
        return await this._getText(this.mainHeader);
    }

}
module.exports= SortablePage;