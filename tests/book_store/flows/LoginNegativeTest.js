const { getHomePage }= require("../../BaseTest.js");
const LoginPage = require("../../../pages/book_store/LoginPage.js");
const { expect }= require('chai');

describe('Authorization negative check', function() {
    const errorMessage="Invalid username or password!";
    /** @type {LoginPage} */
    let loginPage, booksPage;
    beforeEach(async function(){
        const homePage= await getHomePage();
        booksPage= await homePage.gotoBookStoreApplication();
        loginPage= await booksPage.clickLoginButton();
    });
    describe('smoke: Negative functionality check', function(){
        it('should fail to login if username is not valid', async function(){
            const username= "Namr";
            const password= "Qwerty123!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Successful authorization").to.be.true;
            const ActualErrorMessage= await loginPage.getErrorMessage();
            expect(ActualErrorMessage, "Authorization failed, but system did not show expected error").to.be.equal(errorMessage);
        });
        it('should fail to login if password is not valid', async function(){
            const username= "Name";
            const password= "Qwerti123!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Successful authorization").to.be.true;
            const ActualErrorMessage= await loginPage.getErrorMessage();
            expect(ActualErrorMessage, "Authorization failed, but system did not show expected error").to.be.equal(errorMessage);
        });
        it('should fail to login with incorrect password letter case', async function(){
            // Known issue: Bug-008, 009
            const username= "Name";
            const password= "QwertY123!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Successful authorization with incorrect password letter case. Bugs: 008, 009").to.be.true;
            const ActualErrorMessage= await loginPage.getErrorMessage();
            expect(ActualErrorMessage, "Authorization failed, but system did not show expected error").to.be.equal(errorMessage);
        });
    });
    describe('regression: Negative functionality check', function(){
        it('should fail login with leading spaces in username', async function(){
            const username= " Name";
            const password= "Qwerty123!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Successful authorization").to.be.true;
            const ActualErrorMessage= await loginPage.getErrorMessage();
            expect(ActualErrorMessage, "Authorization failed, but system did not show expected error").to.be.equal(errorMessage);
        });
        it('should fail login with leading spaces in password', async function(){
            const username= "Name";
            const password= " Qwerty123!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Successful authorization").to.be.true;
            const ActualErrorMessage= await loginPage.getErrorMessage();
            expect(ActualErrorMessage, "Authorization failed, but system did not show expected error").to.be.equal(errorMessage);
        });
        it('should fail login with trailing spaces in credentials', async function(){
            // Known issue: Bug-003, 010
            const username= "Name ";
            const password= "Qwerty123! ";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Successful authorization with trailing spaces in credentials. Bugs: 003, 010").to.be.true;
            const ActualErrorMessage= await loginPage.getErrorMessage();
            expect(ActualErrorMessage, "Authorization failed, but system did not show expected error").to.be.equal(errorMessage);
        });
        it('should check login fails gracefully when credentials exceed supported length (42 characters)', async function(){
            const username= "ThisUserCanNotExist!@#$%^&*AAAAAAAaaaaaaaa1";
            const password= "ThisUserCanNotExist!@#$%^&*AAAAAAApassword1";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Successful authorization").to.be.true;
            const ActualErrorMessage= await loginPage.getErrorMessage();
            expect(ActualErrorMessage, "Authorization failed, but system did not show expected error").to.be.equal(errorMessage);
        });
        it('should check login fails gracefully SQL-injection in username field', async function(){
            const username= "' OR 1=1 --";
            const password= "Qwerty123!";
            await loginPage.inputCredentials(username, password);
            const loginInFailed= await loginPage.isLoginInFailed();
            this.authSucceeded = !loginInFailed;
            expect(loginInFailed, "Error! Successful authorization").to.be.true;
            const ActualErrorMessage= await loginPage.getErrorMessage();
            expect(ActualErrorMessage, "Authorization failed, but system did not show expected error").to.be.equal(errorMessage);
        });
        
    });
});