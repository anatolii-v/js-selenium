const { getHomePage } = require("../../BaseTest.js");
const { getPageByMenuItem } = require("../../../utils/PageFactoryUtils.js");
const api = require("../../../api");
const { loginTestUser } = require("../../helpers/LoginHelper.js");
const ProfilePage = require("../../../pages/book_store/ProfilePage.js");
const LoginPage = require("../../../pages/book_store/LoginPage.js");
const { refreshPage }= require("../../../utils/BrowserUtils.js");
const { getAlertText, acceptAlert } = require("../../../utils/AlertUtils.js");
const { expect }= require('chai');

describe('Delete User Account flow check', function() {
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
        await profilePage.gotoLoginPage();
        await loginTestUser(this);
    });
    describe('smoke: Basic successful deletion flow check', function(){
        it('should check the delete modal dialog visibility', async function(){
            const errorMessage="Invalid username or password!";
            const alertMessage="User Deleted.";
            await profilePage.waitUserPageReady();
            await profilePage.deleteAccount();
            await profilePage.confirmAccountDeletion();
            const alertText = await getAlertText(this.driver);
            expect(alertText, "Actual and expected alert messages do not match").to.be.equal(alertMessage);
            await acceptAlert(this.driver);
            loginPage= new LoginPage(profilePage.driver);
            await loginPage.waitNotLoggedInState();
            const currentUrl= await loginPage.getLoginPageUrl();
            expect(currentUrl, "Error! Wrong redirect link").to.be.include("/login");
            await loginPage.inputCredentials(this.testUser.userName, this.testUser.password);
            const loginInFailed= await loginPage.isLoginInFailed();
            expect(loginInFailed, "Error! System behaved unexpectedly").to.be.true;
            const ActualErrorMessage= await loginPage.getErrorMessage();
            expect(ActualErrorMessage, "Actual and expected error messages do not match").to.be.equal(errorMessage);
        });
    });
    describe('regression: Handle of expired token session check', function(){
        it.skip('should check previous token login session closes correctly after account deletion', async function(){
            // Skipped due to known issue: Bug-020
            await profilePage.waitUserPageReady();
            await api.user.deleteUser(this.testUser);
            await refreshPage(profilePage.driver);
            // Expected: user should be redirected to logged-out state
            // Actual: blank page (BUG!!!)
            await profilePage.waitNotLoggedInState();
            await profilePage.gotoLoginPage();
            loginPage= new LoginPage(profilePage.driver);
            await loginPage.waitNotLoggedInState();
            await loginPage.inputCredentials(this.testUser.userName, this.testUser.password);
            const loginInFailed= await loginPage.isLoginInFailed();
            expect(loginInFailed, "Error! System behaved unexpectedly").to.be.true;
        });
    });
});