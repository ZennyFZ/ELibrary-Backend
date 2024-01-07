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
    role: {
        type: String,
        require: true
    },
    isPremium: {
        type: Boolean,
        require: true
    },
    premiumExpiry: {
        type: Date
    },
    bookList: [{
        type: String
    }],
}, {timestamps: true});

const Users = mongoose.model("users", userSchema);
module.exports = Users;