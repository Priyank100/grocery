const UserModel = require('../model/user.model');

class UserServices {
    static async registerUser(dateTime, name, profile, email, password, mobile, address, city, pin) {
        try {
            const createUser = new UserModel({dateTime, name, profile, email, password, mobile, address, city, pin});
            return await createUser.save();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserServices;