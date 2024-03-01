const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logSchema = new Schema({
    data: { 
        type: String, 
        required: true 
    },
},{ timestamps: true, });

const logs = mongoose.model("logs", logSchema);
module.exports = logs;