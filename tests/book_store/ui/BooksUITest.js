const { getHomePage } = require("../../BaseTest.js");
const api = require("../../../api");
const { loginTestUser } = require("../../helpers/LoginHelper.js");
const { logoutTestUser } = require("../../helpers/LogoutHelper.js");
const LoginPage = require("../../../pages/book_store/LoginPage.js");
const BooksPage = require("../../../pages/book_store/BooksPage.js");
const { expect }= require('chai');


describe('Books Page UI check', function() {
    /** @type {BooksPage} */
    let booksPage, loginPage;
    before(async function() {
        this.testUser = await api.user.createUser();
    });
    beforeEach(async function() {
        const homePage= await getHomePage();
        booksPage= await homePage.gotoBookStoreApplication();
    });
    after(async function() {
        await api.user.deleteUser(this.testUser);
    });
    describe('smoke: Basic UI check', function() {
        describe('smoke: Not logged-in state of the page', function(){
            it('should check the visibility of Login button', async function(){
                const isDisplayed= await booksPage.isLoginButtonDisplayed();
                expect(isDisplayed, 'Login button is not displayed').to.be.true;
            });
        });
        describe('smoke: Logged-in state of the page', function(){
            beforeEach(async function() {
                await booksPage.clickLoginButton();
                await loginTestUser(this);
            });
            afterEach(async function() {
                await logoutTestUser(this);
            });
            it('should login in', async function(){
                await booksPage.waitUserPageReady();
                const currentUrl= await booksPage.getBooksPageUrl();
                expect(currentUrl, "Error! Wrong redirect link").to.be.include("/books");
                const actualLoggedInUsername= await booksPage.getUserName();
                expect(actualLoggedInUsername, 'Error!!! Wrong logged-in Username').to.be.equal(this.testUser.userName);   
            });
        });
    });
    describe('regression: Session-ending flows', function(){
        beforeEach(async function () {
            await booksPage.clickLoginButton();
            await loginTestUser(this);
        });
        it('should check successful log out with redirection to login page', async function(){
            await booksPage.waitUserPageReady();
            await booksPage.clickLogoutButton();
            loginPage= new LoginPage(booksPage.driver);
            await loginPage.waitNotLoggedInState();
            const currentUrl= await loginPage.getLoginPageUrl();
            expect(currentUrl, "Error! Wrong redirect link").to.be.include("/login");
        });
    });
});