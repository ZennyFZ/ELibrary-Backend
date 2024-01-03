const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
}, {timestamps: true});

const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);
module.exports = OrderDetail;