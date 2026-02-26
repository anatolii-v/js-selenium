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
  }

  _getCardLocator(cardName){
    return { xpath: `${this.cardPrefix}${cardName}']`};

  }  
  async gotoElements() {
    const elementsCard=this._getCardLocator(this.cardNames[0]);
    await this._click(elementsCard);
    return new ElementsPage(this.driver);
  }
  async gotoForms() {
    const formsCard= this._getCardLocator(this.cardNames[1]);
    await this._click(formsCard);
    return new FormsPage(this.driver);
  }
  async gotoAlertsFrameWindows() {
    const alertsFrameWindowsCard= this._getCardLocator(this.cardNames[2]);
    await this._click(alertsFrameWindowsCard);
    return new AlertsFrameWindowsPage(this.driver);
  }
  async gotoWidgets() {
    const widgetsCard= this._getCardLocator(this.cardNames[3]);
    await this._click(widgetsCard);
    return new WidgetsPage(this.driver);
  }
  async gotoInteractions() {
    const interactionsCard= this._getCardLocator(this.cardNames[4]);
    await this._click(interactionsCard);
    return new InteractionsPage(this.driver);
  }
  async gotoBookStoreApplication() {
    const bookStoreApplicationCard= this._getCardLocator(this.cardNames[5]);
    await this._click(bookStoreApplicationCard);
    return new BooksPage(this.driver);
  }
}
module.exports = HomePage;