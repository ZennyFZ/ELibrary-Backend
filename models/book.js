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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        require: true
    },
    file: {
        type: String, 
        require: true
    }
},{ timestamps: true, });

const books = mongoose.model("books", bookSchema);
module.exports = books;