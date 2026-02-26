const axios = require('axios');

const BASE_URL = 'https://demoqa.com';
class UserApi {
    _generateUser() {
        const now = new Date().toISOString().replace(/[:.]/g, '-');
        return {
            userName: `test_user_${now}`,
            password: 'Test123!'
        };
    }
    async _generateToken(user) {
        const tokenResponse = await axios.post(`${BASE_URL}/Account/v1/GenerateToken`,
            {   userName: user.userName,
                password: user.password} );
        const token = tokenResponse.data.token;
        return token;
    }
    async createUser() {
        const user = this._generateUser();
        const response = await axios.post(`${BASE_URL}/Account/v1/User`, user);
        user.userId = response.data.userID;
        user.books= response.data.books;
        return user;
    }
    async deleteUser(user) {
        const token= await this._generateToken(user);
        await axios.delete(`${BASE_URL}/Account/v1/User/${user.userId}`,
            {headers: {Authorization: `Bearer ${token}`}});
    }
    async getUserBooks(user) {
        const token= await this._generateToken(user);
        const userResponse= await axios.get(`${BASE_URL}/Account/v1/User/${user.userId}`,
            {headers: {Authorization: `Bearer ${token}`}});
        const userBooks= userResponse.data.books;
        return userBooks;
    }
    async createPermanentUser(userName, password) {
        try {
            await axios.post(`${BASE_URL}/Account/v1/User`,
            {   userName: userName,
                password: password
            });
            console.log(`Permanent user "${userName}" created`);
        } catch (error) {
            if (error.response?.status === 406) {
                console.log(`Permanent user "${userName}" already exists`);
            } else {
                throw error;
            }
        }
    }
}
module.exports = new UserApi();