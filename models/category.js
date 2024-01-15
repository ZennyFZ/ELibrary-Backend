const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        require: true
    }
}, {timestamps: true});

const Categories = mongoose.model("categories", categorySchema);
module.exports = Categories;