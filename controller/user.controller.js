const UserServices = require('../services/user.service');

exports.register = async(req, res, next) => {
    try {
        const {name, profile, email, password, mobile, address, city, pin} = req.body;
        const dateTime = new Date().toJSON().slice(0,19).replace('T','-');
        const successRes = await UserServices.registerUser(dateTime, name, profile, email, password, mobile, address, city, pin);
        res.json({status:true, message:"User registered successfully"});
    } catch(error) {
        throw error;
    }
}