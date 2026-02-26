const LoginPage = require("../../pages/book_store/LoginPage.js");

async function loginTestUser(context) {
    // Use the user from API
    const loginPage= await new LoginPage(context.driver);
    const user= context.testUser;
    await loginPage.inputCredentials(user.userName, user.password);
}
module.exports = { loginTestUser };