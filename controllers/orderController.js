const order = require("../models/order");
const orderDetail = require("../models/orderDetail");

class Order {

    createOrder(req, res, next) {
        console.log("createOrder");
    }

    getAllOrders(req, res, next) {
        order.find({}).populate('user').then((orders) => {
            res.json(orders);
        }).catch((err) => {
            res.status = 500;
            res.json("Internal Server Error");
        });
    }

    getOrderByUserId(req, res, next) {
        order.find({user: req.body.userId}).populate('user').then((orders) => {
            res.status = 200
            res.json(orders);
        }).catch((err) => {
            res.status = 500;
            res.json("Internal Server Error");
        });
    }

    getOrderDetailByOrderId(req, res, next) {
        orderDetail.find({order: req.params.id }).then((orderDetails) => {
            res.status = 200;
            res.json(orderDetails);
        }).catch((err) => {
            res.status = 500;
            res.json("Internal Server Error");
        });
    }

}

module.exports = new Order();