const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { 
        type: String,
        require: true
    },
    author: { 
        type: String,
        require: true
    },
    publisher: {
        type: String, 
        require: true
    },
    publishDate: {
        type: Date, 
        require: true
    },
    pages: {
        type: Number, 
        require: true
    },
    language: {
        type: String, 
        require: true
    },
    price: {
        type: Number, 
        require: true
    },
    image: {
        type: String, 
        require: true
    },
    description: {
        type: String, 
        require: true
    },
    quantity: {
        type: Number, 
        require: true
    },
    isDeleted: {
        type: Boolean, 
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        require: true
    },
},{ timestamps: true, });

const books = mongoose.model("Book", bookSchema);
module.exports = books;