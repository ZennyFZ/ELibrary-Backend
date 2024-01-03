const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { 
        type: String,
        require: true
    },
    email: { 
        type: String,
        require: true
    },
    password: {
        type: String, 
        require: true
    },
    dob: {
        type: Date, 
    },
    phone: {
        type: String, 
        require: true
    },
    isAdmin: {
        type: Boolean, 
        require: true
    },
}, {timestamps: true});

const Users = mongoose.model("Users", userSchema);
module.exports = Users;