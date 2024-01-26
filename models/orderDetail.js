const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: "order",
        required: true,
    },
    bookList: [{}]
}, {timestamps: true});

const OrderDetail = mongoose.model("orderdetails", orderDetailSchema);
module.exports = OrderDetail;