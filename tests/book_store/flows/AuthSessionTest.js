const { getHomePage }= require("../../BaseTest.js");
const LoginPage = require('../../../pages/book_store/LoginPage.js');
const AuthenticatedPage = require("../../../pages/book_store/AuthenticatedPage.js");
const { refreshPage } = require("../../../utils/BrowserUtils.js");
const { expect }= require('chai');

describe('Authorization state-based behavior check', function() {
    /** @type {LoginPage} */
    let loginPage, booksPage;
    beforeEach(async function(){
        const homePage= await getHomePage();
        booksPage= await homePage.gotoBookStoreApplication();
        loginPage= await booksPage.clickLoginButton();
    });
    describe('smoke: State-based behavior check', function(){
        it('should check failing access after logout', async function(){
            const username= "Name";
            const password= "Qwerty123!";
            await loginPage.inputCredentials(username, password);
            const userPage= new AuthenticatedPage(loginPage.driver);
            await userPage.clickLogoutButton();
            await loginPage.menu.clickMenuItem("Book Store Application", "Book Store");
            const notAuth= await booksPage.isLoginButtonVisible();
            expect(notAuth, "Error! System is not in expected state").to.be.true;
            const isThereUserName = await booksPage.isUserNameDisplayed();
            expect(isThereUserName, 'UserName is displayed on the page').to.be.false;
        });
    });
    describe('regression: State-based behavior check', function(){
        it('should prevent logging in when already authenticated', async function(){
            const username= "Name User123";
            const password= "Qwe123!!!";
            const expectedMessage= "You are already logged in.";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            await booksPage.menu.clickMenuItem("Book Store Application", "Login");
            const isAuth= await loginPage.isLoginPageInAuthState();
            expect(isAuth, "Error! System is not in expected state").to.be.true;
            const actualMessage= await loginPage.getAlreadyLoggedInMessage();
            expect(actualMessage, `Actual message does not include ${expectedMessage}`).to.be.include(expectedMessage);
        });
        it('should check authorized state after page refresh', async function(){
            const username= "Name User123";
            const password= "Qwe123!!!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            const userPage= new AuthenticatedPage(loginPage.driver);
            await refreshPage(loginPage.driver);
            await userPage.waitUserPageReady();
            const isThereUserName = await booksPage.isUserNameDisplayed();
            expect(isThereUserName, 'UserName is not logged in after refresh the page').to.be.true;
        });
    });
});