const order = require("../models/order");
const orderDetail = require("../models/orderDetail");
const book = require("../models/book");
const user = require("../models/user");
const { default: mongoose } = require("mongoose");

class OrderController {

    async createOrder(req, res, next) {
        try {
            const bookListArray = req.body.bookList;
            const userId = req.body.userId;

            //check if the user has the book in their book list
            const checkBookExist = await user.findById(userId).then((user) => {
                for (let i = 0; i < bookListArray.length; i++) {
                    for (let j = 0; j < user.bookList.length; j++) {
                        if (bookListArray[i]._id == user.bookList[j]._id) {
                            return true;
                        }
                    }
                }
            })

            if (checkBookExist) {
                return res.status(500).json("The user already has the book in their library")
            }

            //create order
            const newOrder = new order({
                user: userId,
                orderDate: new Date(),
                totalPrice: req.body.totalPrice,
                paymentMethod: req.body.paymentMethod
            });

            newOrder.save().then((order) => {
                if (order) {
                    //create order detail
                    const newOrderDetail = new orderDetail({
                        order: order._id,
                        bookList: bookListArray
                    });
                    newOrderDetail.save()

                    //update user book list
                    user.findById(userId).then((user) => {
                        user.bookList.push(...bookListArray);
                        user.save().then((user) => {
                            if (user) {
                                res.status(200).json("Order successfully created")
                            }
                        });
                    });
                }
            })

        } catch (err) {
            res.status(500).json(`Internal Server Error ${err}`)
        }
    }

    getAllOrders(req, res, next) {
        order.find({}).populate('user').sort( { "orderDate": -1 } ).then((orders) => {
            res.json(orders);
        }).catch((err) => {
            console.log(err);
            res.status = 500;
            res.json("Internal Server Error");
        });
    }

    getOrderByUserId(req, res, next) {
        order.find({ user: req.params.id }).populate('user').then((orders) => {
            res.status = 200
            orders.forEach(order => {
                order.user.password = undefined;
            });
            res.json(orders);
        }).catch((err) => {
            res.status = 500;
            res.json("Internal Server Error");
        });
    }

    getOrderDetailByOrderId(req, res, next) {
        orderDetail.find({ order: req.params.id }).then((orderDetails) => {
            res.status = 200;
            res.json(orderDetails);
        }).catch((err) => {
            res.status = 500;
            res.json("Internal Server Error");
        });
    }

}

module.exports = new OrderController();