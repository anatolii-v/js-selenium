const AuthenticatedPage = require("../../pages/book_store/AuthenticatedPage.js");

async function logoutTestUser(context) {
    const authPage= await new AuthenticatedPage(context.driver);
    await authPage.clickLogoutButton();
}
module.exports = { logoutTestUser };