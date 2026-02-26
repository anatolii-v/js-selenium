const { getHomePage } = require("../../BaseTest.js");
const { getPageByMenuItem } = require("../../../utils/PageFactoryUtils.js");
const api = require("../../../api");
const { loginTestUser } = require("../../helpers/LoginHelper.js");
const { logoutTestUser } = require("../../helpers/LogoutHelper.js");
const ProfilePage = require("../../../pages/book_store/ProfilePage.js");
const LoginPage = require("../../../pages/book_store/LoginPage.js");
const { expect }= require('chai');
const BooksPage = require("../../../pages/book_store/BooksPage.js");


describe('Profile Page UI check', function() {
    /** @type {ProfilePage} */
    let profilePage, booksPage, loginPage;
    before(async function() {
        this.testUser = await api.user.createUser();
    });
    beforeEach(async function() {
        const homePage= await getHomePage();
        booksPage= await homePage.gotoBookStoreApplication();
        await booksPage.menu.clickMenuItem("Book Store Application", "Profile");
        profilePage= await getPageByMenuItem(this.driver, "Profile");
    });
    after(async function() {
        await api.user.deleteUser(this.testUser);
    });
    describe('smoke: Basic UI check', function() {
        describe('smoke: Not logged-in state of the page', function(){
            it('should check the visibility of not logged-in message on the page', async function(){
                const actualMessage = await profilePage.getNotLogginMessage();
                const expectedMessage= "Currently you are not logged into the Book Store application, please visit the login page to enter or register page to register yourself.";
                expect(actualMessage, 'Actual and expected not-logged in messages do not match').to.be.equal(expectedMessage);
            });
            it('should check the link to the login page', async function(){
                await profilePage.gotoLoginPage();
                loginPage= new LoginPage(profilePage.driver);
                await loginPage.waitNotLoggedInState();
                const actualMessage = await loginPage.getWelcomeMessage();
                const expectedMessage= "Welcome, Login in Book Store";
                expect(actualMessage, 'Actual and expected welcome messages do not match').to.be.equal(expectedMessage);
            });
            /*it('should check the link to the register page', async function(){
                await profilePage.gotoRegisterPage();
                registerPage= new RegisterPage(profilePage.driver);
                await registerPage.waitPageReady();
                const currentUrl= await registerPage.getRegisterPageUrl();
                expect(currentUrl, "Error! Wrong redirect link").to.be.include("/register");
            });*/
        });
        describe('smoke: Logged-in state of the page', function(){
            beforeEach(async function() {
                await profilePage.gotoLoginPage();
                await loginTestUser(this);
            });
            afterEach(async function() {
                await logoutTestUser(this);
            });
            it('should login in', async function(){
                await profilePage.waitUserPageReady();
                const currentUrl= await profilePage.getProfilePageUrl();
                expect(currentUrl, "Error! Wrong redirect link").to.be.include("/profile");
                const actualLoggedInUsername= await profilePage.getUserName();
                expect(actualLoggedInUsername, 'Error!!! Wrong logged-in Username').to.be.equal(this.testUser.userName);   
            });
        });
    });
    describe('regression: Basic UI check', function(){
        beforeEach(async function () {
            await profilePage.gotoLoginPage();
            await loginTestUser(this);
        });
        describe('regression: Logged-in state (non-destructive)', function(){
            afterEach(async function() {
                await logoutTestUser(this);
            });
            it('should check the "Books:" label visibility', async function(){
                const expectedBooksLabelText= "Books :";
                const isDisplayed= await profilePage.isBooksLabelDisplayed();
                expect(isDisplayed, "The 'Books:' label does not displayed").to.be.true;
                const actualBooksLabelText= await profilePage.getBooksLabelText();
                expect(actualBooksLabelText, 'Actual and expected Books Label Text do not match').to.be.equal(expectedBooksLabelText);   
            });
            it('should check redirection to the Book Store', async function(){
                await profilePage.waitUserPageReady();
                await profilePage.gotoBookStore();
                booksPage= new BooksPage(profilePage.driver);
                await booksPage.waitUserPageReady();
                const currentUrl= await booksPage.getBooksPageUrl();
                expect(currentUrl, "Error! Wrong redirect link").to.be.include("/books");
            });
            it('should check the delete modal dialog visibility', async function(){
                await profilePage.waitUserPageReady();
                await profilePage.deleteAccount();
                const actualMessage= await profilePage.getDeleteModalMessage();
                const expectedMessage= "Do you want to delete your account?";
                expect(actualMessage, 'Actual and expected messages in Delete Modal do not match').to.be.equal(expectedMessage);
                let isDisplayed= await profilePage.isCloseDeleteModalDisplayed();
                expect(isDisplayed, "There is no Close Button in Delete Modal").to.be.true;
                isDisplayed= await profilePage.isOkModalButtonDisplayed();
                expect(isDisplayed, "There is no Ok Button in Delete Modal").to.be.true;
                isDisplayed= await profilePage.isCancelModalButtonDisplayed();
                expect(isDisplayed, "There is no Cancel Button in Delete Modal").to.be.true;
                await profilePage.closeDeleteModal();
                const actualLoggedInUsername= await profilePage.getUserName();
                expect(actualLoggedInUsername, 'There is no Username on the page').to.be.equal(this.testUser.userName);  
            })
            it('should check the delete modal dialog buttons enabling', async function(){
                await profilePage.waitUserPageReady();
                await profilePage.deleteAccount();
                let isEnabled= await profilePage.isOkModalButtonEnabled();
                expect(isEnabled, "Ok Button in Delete Modal is not enabled").to.be.true;
                isEnabled= await profilePage.isCancelModalButtonEnabled();
                expect(isEnabled, "Cancel Button in Delete Modal is not enabled").to.be.true;
                await profilePage.cancelAccountDeletion();
                const actualLoggedInUsername= await profilePage.getUserName();
                expect(actualLoggedInUsername, 'There is no Username on the page').to.be.equal(this.testUser.userName);
            })
        });
        describe('regression: Session-ending flows', function(){
            it('should check successful log out with redirection to login page', async function(){
                await profilePage.waitUserPageReady();
                await profilePage.clickLogoutButton();
                loginPage= new LoginPage(profilePage.driver);
                await loginPage.waitNotLoggedInState();
                const currentUrl= await loginPage.getLoginPageUrl();
                expect(currentUrl, "Error! Wrong redirect link").to.be.include("/login");
            });
        });
    });
});