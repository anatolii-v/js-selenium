const BasePage = require("./BasePage.js");
const ElementsPage = require('./ElementsPage.js');
const FormsPage = require('./FormsPage.js');
const AlertsFrameWindowsPage = require('./AlertsFrameWindowsPage.js');
const WidgetsPage = require('./WidgetsPage.js');
const InteractionsPage = require('./InteractionsPage.js');
const BooksPage = require("./book_store/BooksPage.js");

class HomePage extends BasePage 
{
  constructor(driver) {
    super(driver);
    this.cardPrefix= "//div[@id='app']//h5[text()='";
    this.cardNames=['Elements', 'Forms', 'Alerts, Frame & Windows', 'Widgets', 'Interactions', 'Book Store Application'];
    this.baseUrl = process.env.DEMOQA_BASE_URL || 'https://demoqa.com';
  }

  _getCardLocator(cardName){
    return { xpath: `${this.cardPrefix}${cardName}']`};

  }  
  async gotoElements() {
    const elementsCard=this._getCardLocator(this.cardNames[0]);
    try {
      await this._click(elementsCard);
    } catch (err) {
      await this.driver.get(`${this.baseUrl}/elements`);
    }
    return new ElementsPage(this.driver);
  }
  async gotoForms() {
    const formsCard= this._getCardLocator(this.cardNames[1]);
    try {
      await this._click(formsCard);
    } catch (err) {
      await this.driver.get(`${this.baseUrl}/forms`);
    }
    return new FormsPage(this.driver);
  }
  async gotoAlertsFrameWindows() {
    const alertsFrameWindowsCard= this._getCardLocator(this.cardNames[2]);
    try {
      await this._click(alertsFrameWindowsCard);
    } catch (err) {
      await this.driver.get(`${this.baseUrl}/alertsWindows`);
    }
    return new AlertsFrameWindowsPage(this.driver);
  }
  async gotoWidgets() {
    const widgetsCard= this._getCardLocator(this.cardNames[3]);
    try {
      await this._click(widgetsCard);
    } catch (err) {
      await this.driver.get(`${this.baseUrl}/widgets`);
    }
    return new WidgetsPage(this.driver);
  }
  async gotoInteractions() {
    const interactionsCard= this._getCardLocator(this.cardNames[4]);
    try {
      await this._click(interactionsCard);
    } catch (err) {
      await this.driver.get(`${this.baseUrl}/interaction`);
    }
    return new InteractionsPage(this.driver);
  }
  async gotoBookStoreApplication() {
    const bookStoreApplicationCard= this._getCardLocator(this.cardNames[5]);
    try {
      await this._click(bookStoreApplicationCard);
    } catch (err) {
      await this.driver.get(`${this.baseUrl}/books`);
    }
    return new BooksPage(this.driver);
  }
}
module.exports = HomePage;