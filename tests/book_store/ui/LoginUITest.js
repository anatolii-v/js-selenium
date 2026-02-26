const { getHomePage }= require("../../BaseTest.js");
const LoginPage = require('../../../pages/book_store/LoginPage.js');
const AuthenticatedPage = require("../../../pages/book_store/AuthenticatedPage.js");
const ProfilePage = require("../../../pages/book_store/ProfilePage.js");
const { expect }= require('chai');
const { user } = require("../../../api/index.js");

describe('Login Page UI check', function() {
    /** @type {LoginPage} */
    let loginPage, booksPage, userPage;
    beforeEach(async function(){
        const homePage= await getHomePage();
        booksPage= await homePage.gotoBookStoreApplication();
        loginPage= await booksPage.clickLoginButton();
    });
    describe('smoke: Basic UI check', function(){
        it('should check the visibility of welcome message on the page', async function(){
            const actualMessage = await loginPage.getWelcomeMessage();
            const expectedMessage= "Welcome, Login in Book Store";
            expect(actualMessage, 'Actual and expected welcome messages do not match').to.be.equal(expectedMessage);
        });
        it('should fail login if username is empty', async function(){
            const username= "";
            const password= "Qwerty123!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! System behaved unexpectedly").to.be.true;
            const validity= await loginPage.getUsernameValidity();
            expect(validity, "Username`s field frame is not red").to.be.false;
        });
        it('should fail login if password is empty', async function(){
            const username= "Name";
            const password= "";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! System behaved unexpectedly").to.be.true;
            const validity= await loginPage.getPasswordValidity();
            expect(validity, "Password`s field frame is not red").to.be.false;
        });
    });
    describe('regression: Basic UI check', function(){
        it('should check the text of error message for invalid credentials', async function(){
            const username= "NotExistingUser";
            const password= "not_existing_password";
            const errorMessage="Invalid username or password!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! System behaved unexpectedly").to.be.true;
            const isMessageDisplayed= await loginPage.isErrorMessageDisplayed();
            expect(isMessageDisplayed, "Error! There is no error message on page").to.be.true;
            const ActualErrorMessage= await loginPage.getErrorMessage();
            expect(ActualErrorMessage, "Actual and expected error messages do not match").to.be.equal(errorMessage);
        });
        it('should check the color of the error message', async function(){
            const username= "NotExistingUser";
            const password= "not_existing_password";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! System behaved unexpectedly").to.be.true;
            const ActualErrorMessageColor= await loginPage.verifyErrorMessageColor();
            expect(ActualErrorMessageColor, "Actual and expected error message colors do not match").to.be.equal("rgba(255, 0, 0, 1)");
        });
        it('should mask password input characters', async function () {
            const isMasked = await loginPage.isPasswordMasked();
            expect(isMasked, 'Password field is not masked').to.be.true;
        });
        it('should check the error message disappearing after new input in a field begins', async function(){
            const username= "NotExistingUser";
            const password= "not_existing_password";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            await loginPage.typeUsername("U");
            const isMessageDisplayed= await loginPage.isErrorMessageDisplayed();
            expect(isMessageDisplayed, "Error! There is error message on page").to.be.false;
        });
        it('should login successfully using keyboard navigation', async function(){
            const username= "Name";
            const password= "Qwerty123!";
            await loginPage.loginWithKeyboard(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Authorization was not successful").to.be.false;
            userPage= new AuthenticatedPage(loginPage.driver);
            const actualUserName = await userPage.getUserName();
            expect(actualUserName, 'Actual and expected usernames do not match').to.be.equal(username);
        });
        it('should check redirect behavior to the Profile from Login page in auth state', async function(){
            const username= "Name User123";
            const password= "Qwe123!!!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            await booksPage.menu.clickMenuItem("Book Store Application", "Login");
            await loginPage.goToProfileFromAlreadyLoggedInMessage();
            userPage= new ProfilePage(loginPage.driver);
            await userPage.waitUserPageReady();
            const currentUrl= await userPage.getProfilePageUrl();
            expect(currentUrl, "Error! Wrong redirect link").to.be.include("/profile");
            const isAuth= await userPage.isUserNameDisplayed();
            expect(isAuth, "Error! System is not in expected state").to.be.true;
            const actualUserName = await userPage.getUserName();
            expect(actualUserName, 'Username does not right').to.be.equal(username);

        });
    });
});