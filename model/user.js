const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profile:String,
    name:String,
    email:String,
    password:String,
    mobile:String,
    dob:String,
    state:String,
    city:String,
    address:String,
    pin:String
});

module.exports = mongoose.model("users",userSchema);