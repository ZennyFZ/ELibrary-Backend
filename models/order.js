const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    orderDate: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
}, {timestamps: true});

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;