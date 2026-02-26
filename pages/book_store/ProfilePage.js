const AuthenticatedPage = require("./AuthenticatedPage.js");
const MainMenu = require("../../components/MainMenu.js");
const BooksTable = require("../../components/BooksTable.js");
const { waitVisible } = require("../../utils/WaitUtils.js");

class ProfilePage extends AuthenticatedPage
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.booksTable= new BooksTable(driver);
        this.notLogginMessage= { id: "notLoggin-label" };
        this.booksLabel= { id: "userName-label" };
        this.loginLink= { xpath: "//label[@id='notLoggin-label']//a[text()='login']" };
        this.registerLink= { xpath: "//label[@id='notLoggin-label']//a[text()='register']" };
        this.gotoStoreButton= { id: "gotoStore" };
        this.deleteAccountButtonText= "Delete Account";
        this.deleteAllBooksButtonText= "Delete All Books";
        this.deleteModalTitle= { id: "example-modal-sizes-title-sm"};
        this.deleteModalText= { xpath: "//div[contains(text(),'to delete')]"};
        this.deleteModalOkButton= { id: "closeSmallModal-ok"};
        this.deleteModalCancelButton= { id: "closeSmallModal-cancel"};
        this.deleteModalCloseButton= { xpath: "//span[text()='Close']//parent::button"};
    }
    _getdeleteAccountButtonLocator(){
        return { xpath: `${this.buttonsTag}${this.deleteAccountButtonText}']`};
    }
    _getDeleteAllBooksButtonLocator(){
        return { xpath: `(${this.buttonsTag}${this.deleteAllBooksButtonText}'])[2]`};
    }
    async getProfilePageUrl() {
        return await this._getUrl();
    }
    async waitNotLoggedInState(){
        await waitVisible(this.driver, this.notLogginMessage);
    }
    async waitDeleteModal(){
        await waitVisible(this.driver, this.deleteModalTitle);
    }
    async getNotLogginMessage(){
        await this.waitNotLoggedInState();
        const textLines= await this._finds(this.notLogginMessage);
        const Message= await Promise.all(textLines.map(text => this._getText(text)));
        return Message.join(' ').replace(/\s+/g, ' ').trim();
    }
    async gotoBookStore(){
        await this._click(this.gotoStoreButton);
    }
    async deleteAccount(){
        const locator= await this._getdeleteAccountButtonLocator();
        await this._click(locator);
    }
    async gotoLoginPage(){
        await this.waitNotLoggedInState();
        await this._click(this.loginLink);
    }
    async gotoRegisterPage(){
        await this.waitNotLoggedInState();
        await this._click(this.registerLink);    
    }
    async getLabelText(){
        await this.waitUserPageReady();
        const labels= await this._finds(this.userNameLabel);
        const labelsText= await Promise.all(labels.map(el => this._getText(el)));
        return labelsText.join('&');
    }
    async getDeleteModalHeader(){
        await this.waitDeleteModal();
        return await this._getText(this.deleteModalTitle);
    }
    async getDeleteModalMessage(){
        await this.waitDeleteModal();
        return await this._getText(this.deleteModalText);
    }
    async getBooksLabelText(){
        await this.waitUserPageReady();
        return await this._getText(this.booksLabel);
    }
    async isBooksLabelDisplayed(){
        await this.waitUserPageReady();
        return await this._isDisplayed(this.booksLabel);
    }
    async cancelAccountDeletion(){
        await this.waitDeleteModal();
        await this._click(this.deleteModalCancelButton);
    }
    async confirmAccountDeletion(){
        await this.waitDeleteModal();
        await this._click(this.deleteModalOkButton);
    }
    async closeDeleteModal(){
        await this.waitDeleteModal();
        await this._click(this.deleteModalCloseButton);
    }
    async isCloseDeleteModalDisplayed(){
        await this.waitDeleteModal();
        return await this._isDisplayed(this.deleteModalCloseButton);
    }
    async isOkModalButtonDisplayed(){
        await this.waitDeleteModal();
        return await this._isDisplayed(this.deleteModalOkButton);
    }
    async isCancelModalButtonDisplayed(){
        await this.waitDeleteModal();
        return await this._isDisplayed(this.deleteModalCancelButton);
    }
    async isOkModalButtonEnabled(){
        await this.waitDeleteModal();
        return await this._isEnabled(this.deleteModalOkButton);
    }
    async isCancelModalButtonEnabled(){
        await this.waitDeleteModal();
        return await this._isEnabled(this.deleteModalCancelButton);
    }
}
module.exports= ProfilePage;