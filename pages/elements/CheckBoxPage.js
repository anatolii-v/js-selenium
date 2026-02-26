const BasePage = require("../BasePage.js");
const MainMenu = require("../../components/MainMenu.js");

class CheckBoxPage extends BasePage
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.expandAllButton={ xpath: "//button[@title='Expand all']"};
        this.collapseAllButton={ xpath: "//button[@title= 'Collapse all']"};
        this.toggleButton= "//parent::span/button";
        this.chBXpathPrefix= "//label[@for='tree-node-";
        this.chBXpathSuffix= "']";
        this.stateXpathSuffix= "/*[name()='svg']";
        this.confirmationMessageXpath= "//div[@id='result']";
    }

    _getChBLocator(node){
        return { xpath: `${this.chBXpathPrefix}${node}${this.chBXpathSuffix}`};
    }
    _getTgButtonLocator(node){
        return { xpath: `${this.chBXpathPrefix}${node}${this.chBXpathSuffix}${this.toggleButton}`};
    }

    async clickExpandAllButton(){
        await this._click(this.expandAllButton);
    }
    async clickCollapseAllButton(){
        await this._click(this.collapseAllButton);
    }

    /** @returns {string} node */
    async getCheckBoxState(node) {
        const locator = { xpath: `${this.chBXpathPrefix}${node}${this.chBXpathSuffix}//span[@class='rct-checkbox']${this.stateXpathSuffix}`};
        const element = await this._find(locator);
        const classAttr = await element.getAttribute('class');

        if (classAttr.includes('rct-icon-check')) return 'check';
        if (classAttr.includes('rct-icon-half-check')) return 'half';
        return 'uncheck';
    }
    async clickChB(node){
        const locator= this._getChBLocator(node);
        const chBState= await this.getCheckBoxState(node);
        if (chBState==='half' || chBState==='uncheck'){
            await this._click(locator);
        }
    }
    async unclickChB(node){
        const locator= this._getChBLocator(node);
        const ChBState=await this.getCheckBoxState(node);
        if (ChBState==='check'){
            await this._click(locator);
        }
        if (ChBState==='half'){
            await this._click(locator);
            await this._click(locator);
        }
    }
    async isNodeExpanded(node){
        const locator={ xpath: `${this.chBXpathPrefix}${node}${this.chBXpathSuffix}${this.toggleButton}${this.stateXpathSuffix}`};
        const element=await this._find(locator);
        const classAttr= await element.getAttribute('class');
        //console.log(`"${node}" class? ->`, classAttr);
        if (classAttr.includes('open')) return true;
        else return false;
    }

    async expandNode(node){
        const locator=this._getTgButtonLocator(node);
        const expanded=await this.isNodeExpanded(node);
        //console.log(`"${node}" expanded? ->`, expanded);
        if (!expanded){
            await this._click(locator);
        }
    }
    async collapseNode(node){
        const locator=this._getTgButtonLocator(node);
        const expanded=await this.isNodeExpanded(node);
        if (expanded){
            await this._click(locator);
        }
    }
    async getCheckedFilesList(){
        return await this._getText({xpath: `${this.confirmationMessageXpath}`});
    }

    /** @param {number} num */
    async getCheckedFilesConfirmation(num){
        return await this._getText({ xpath: `${this.confirmationMessageXpath}//span[${num}]` });
    }
    async verifyColor(num){
        const locator= { xpath: `${this.confirmationMessageXpath}//span[${num}]` };
        return await this._getColorValue(locator, 'color');
    }
    async expandNodes(...path){
        for (let i = 0; i < path.length; i++) {
            await this.expandNode(path[i]);
        }
    }
    async expandAndDo(action, ...path) {
        for (let i = 0; i < path.length-1; i++) {
            await this.expandNode(path[i]);
        }
        const target = path.at(-1);
        if (action === 'click') await this.clickChB(target);
        if (action === 'unclick') await this.unclickChB(target);
    }
}

module.exports= CheckBoxPage;