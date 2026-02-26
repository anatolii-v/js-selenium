const api = require("../../api");

const Test_User = {
  userName: 'Name',
  password: 'Qwerty123!'
};

(async () => {
  try {
    console.log('Ensuring test user exists...');
    await api.user.createPermanentUser(Test_User.userName, Test_User.password);
    console.log('Test user is ready');
  } catch (error) {
    console.error('Failed to ensure test user', error);
    process.exit(1);
  }
})();