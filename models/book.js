const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: { 
        type: Number,
        min: 1,
        max:5,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
},{timestamps: true});

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
    comments: [commentSchema],
},{ timestamps: true, });

const books = mongoose.model("Book", bookSchema);
module.exports = books;