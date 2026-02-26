const BasePage = require("../pages/BasePage.js");
const { waitVisible, waitClickable, waitIsRemoved, waitForFirstVisible } = require("../utils/WaitUtils.js");
const { scrollRelatively, scrollToElement } = require("../utils/BrowserUtils.js");

class BooksTable extends BasePage
{
    constructor(driver){
        super(driver);
        this.searchBox= { id: "searchBox"};
        this.tableColumns= { xpath: "//div[contains(@class,'header-content')]"};
        this.entryOnPage= { xpath: "//div[@class='rt-tbody']//div[@role='row']"};
        this.cell= { xpath: ".//div[@role='gridcell']"};
        this.rowImage= { xpath: ".//img"};
        this.notNullEntry= { xpath: "//div[@class='rt-td']//img[@src]"}; 
        this.noDataText= { xpath: "//div[@class='rt-noData']"};
        this.rowsPerPageSelect= { xpath: "//select"};
        this.rowsPerPageOptions="option";
        this.currentPage= { xpath: "//input[@aria-label='jump to page']"};
        this.totalPages= {xpath: "//span[text()='Page']//span"};
        this.previousPageButton= { xpath: "//button[text()='Previous']"};
        this.nextPageButton= { xpath: "//button[text()='Next']"};

    }

    async getTableColumns(){
        const columns= await this._finds(this.tableColumns);
        const text= await Promise.all(columns.map(col => this._getText(col)));
        return text.join(' ');
    }
    async findBook(title){
        const rows= await this._finds(this.entryOnPage);
        let text;
        for (const row of rows) {
            text = await this._getText(row);
            if (text.includes(title)) {
                return row;
            }
        }
        return null;
    }
    async gotoLink(rowElement) {
        const cells = await this._findsInside(rowElement, this.cell);
        const link= await this._findInside(cells[1], { xpath: ".//a"});
        await this._clickElement(link);
    }
    async gotoBook(title){
        const row= await this.findBook(title);
        await this.gotoLink(row);
    }
    async getBookUrl() {
        return await this._getUrl();
    }
    async rowsPerPage(){
        const select=await this._find(this.rowsPerPageSelect);
        const value= await this._getValue(select);
        return Number(value);
    }
    async rowsPerPageText() {
        const select = await this._find(this.rowsPerPageSelect);
        const selectedOption = await this._findInside(select, { css: `${this.rowsPerPageOptions}:checked`});
        return await this._getText(selectedOption);
    }
    async listRowsPerPage(){
        const select= await this._find(this.rowsPerPageSelect);
        const options= await this._findsInside(select, { css: `${this.rowsPerPageOptions}`});
        let list=[]; 
        let value;
        for (let i=0; i<options.length; i++){
            value= await this._getValue(options[i]);
            list[i]=Number(value);
        }
        return list;
    }
    async listRowsPerPageText(){
        const select=await this._find(this.rowsPerPageSelect);
        const options= await this._findsInside(select, { css: `${this.rowsPerPageOptions}`});
        let list=[]; 
        let value;
        for (let i=0; i<options.length; i++){
            value= await this._getText(options[i]);
            list[i]=value;
        }
        return list;
    }
    async setRowsPerPage(value) {
        const select = await this._find(this.rowsPerPageSelect);
        await this._clickElement(select);
        const option = await select.findElement({ css: `${this.rowsPerPageOptions}[value="${value}"]`});
        await option.click();
    }
    async closeRowsPerPageDropdown(){
        const select = await this._find(this.rowsPerPageSelect);
        await this._clickElement(select);
        await this._pressEscape();
        await scrollRelatively(this.driver, 0, -190);
    }
    async scrollToTheHead(){
        const el= await this._find(this.searchBox);
        await scrollToElement(this.driver, el);
    }
    async isPreviousButtonEnabled(){
        return await this._isEnabled(this.previousPageButton);
    }
    async isNextButtonEnabled(){
        return await this._isEnabled(this.nextPageButton);
    }
    async searchEntries(text){
        await this._set(this.searchBox, text);
    }
    async waitSearchResult(){
        return await waitForFirstVisible(this.driver, this.notNullEntry, this.noDataText);
    }
    async isEntryOnPage({ title, auth, pub }) {
        let entryData;
        const rows = await this._finds(this.entryOnPage);
        for (const row of rows) {
            entryData= (await this._getText(row)).replace(/\s+/g, ' ').trim();
            const matches = entryData.includes(title) && entryData.includes(auth) && entryData.includes(pub);
            if (matches) 
                return true;
        }
        return false;
    }
    async getImageSrc({ title, auth }){
        let entryData;
        const rows = await this._finds(this.entryOnPage);
        for (const row of rows) {
            entryData= (await this._getText(row)).replace(/\s+/g, ' ').trim();   
            const matches = entryData.includes(title) && entryData.includes(auth);
            if (matches) {
                const img= await this._findInside(row, this.rowImage);
                return await this._getSrc(img);
            }
        }
        return null;
    }
    async getTotalNotNullEntriesNumber(){
        const rows= await this._finds(this.entryOnPage);
        let img;
        let number=0;
        for (const row of rows) {
            img = await this._findsInside(row, this.rowImage);
            if (img.length > 0) {
                number++;
            }
            else break;
        }
        return number;
    }
    async deleteCharsFromTextSearch(num = 1){
        await this._backspace(this.searchBox, num);
    }
    async getSearchFieldValue() {
        const element= await this._find(this.searchBox);
        return await this._getValue(element);
    }
    async waitForTableUpdate(previousCount, timeout = 5000) {
        await this.driver.wait(async () => {
            const currentCount = await this.getTotalNotNullEntriesNumber();
            return currentCount !== previousCount;
        }, timeout, 'Table did not update after search change');
    }
    async clickPreviousPageButton(){
        await this._click(this.previousPageButton);
    }
    async clickNextPageButton(){
        await this._click(this.nextPageButton);
    }
    async getTotalPages(){
        const value= await this._getText(this.totalPages);
        return Number(value);
    }
    async getCurrentPageNumber(){
        const element= await this._find(this.currentPage);
        const value= await this._getValue(element);
        return Number(value);
    }
    async getDisplayedBooks(){
        const noBooks= await this._isDisplayed(this.noDataText);
        let books= [];
        if (noBooks) {
            return [];
        }
        const rows = await this._finds(this.entryOnPage);
        for (const row of rows) {
            const entryData= (await this._getText(row)).replace(/\s+/g, ' ').trim();
            if (entryData) {
                books.push(entryData);
            }
        }
        return books;
    }
    async isMessageDisplayed(){
        return await this._isDisplayed(this.noDataText);
    }
}
module.exports= BooksTable;