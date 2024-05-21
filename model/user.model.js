const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const userSchema = new Schema({
    id:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
    profile:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    pin:{
        type:String,
        required:true,
    }
});

const UserModel = db.model('user', userSchema);
module.exports = UserModel;