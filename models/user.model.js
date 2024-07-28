const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({
    username: {
        type: String,
        require:true
    },
    email: {
        type: String,
        require:true,
        unique: true
    },
    password: {
        type: String,
        require:true
    },
    mobile_No: {
        type: Number,
        require:false
    },
    first_Name: {
        type: String,
        require:false
    },
    last_Name: {
        type: String,
        require:false
    },
    bio: {
        type: String,
        require:false
    },
    dob: {
        type: Date,
        require:false
    },
    profile_picture :{
        type: String,
    },
    country :{
        type: String,
        require:false
    }


},{timestamps:true})

const user = new mongoose.model("Users", UserModel) 

module.exports =  user;