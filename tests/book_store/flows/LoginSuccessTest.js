const { getHomePage }= require("../../BaseTest.js");
const LoginPage = require('../../../pages/book_store/LoginPage.js');
const AuthenticatedPage = require("../../../pages/book_store/AuthenticatedPage.js");
const { expect }= require('chai');

describe('Authorization functionality check', function() {
    /** @type {LoginPage} */
    let loginPage, booksPage;
    beforeEach(async function(){
        const homePage= await getHomePage();
        booksPage= await homePage.gotoBookStoreApplication();
        loginPage= await booksPage.clickLoginButton();
    });
    describe('smoke: Basic successful functionality check', function(){
        it('should check successful login', async function(){
            const username= "Name";
            const password= "Qwerty123!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Authorization was not successful").to.be.false;
            const userPage= new AuthenticatedPage(loginPage.driver);
            const actualUserName = await userPage.getUserName();
            expect(actualUserName, 'Actual and expected usernames do not match').to.be.equal(username);
        });
    });
    describe('regression: Basic successful functionality check', function(){
        it('should check successful login with username case-insensitive input', async function(){
            const username= "Name";
            const password= "Qwerty123!";
            const inputUsername= username.charAt(0).toLowerCase() + username.slice(1).toUpperCase();
            await loginPage.inputCredentials(inputUsername, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Authorization was not successful").to.be.false;
            const userPage= new AuthenticatedPage(loginPage.driver);
            const actualUserName = await userPage.getUserName();
            expect(actualUserName, 'Actual and expected usernames do not match').to.be.equal(username);
        });
    });
});