const order = require("../models/order");
const orderDetail = require("../models/orderDetail");
const book = require("../models/book");
const user = require("../models/user");

class Order {

    createOrder(req, res, next) {
        let orderDetailArray = [];
        const bookListIdArray = req.body.bookList;

        // Create order
        const newOrder = new order({
            user: req.body.userId,
            orderDate: new Date(),
            totalPrice: req.body.totalPrice,
            paymentMethod: req.body.paymentMethod
        });

        newOrder.save().then(order => {
            // Fetch all books concurrently and wait for all results
            Promise.all(bookListIdArray.map(bookId => book.findById(bookId))).then(books => {
                orderDetailArray.push(...books);
                const newOrderDetail = new orderDetail({
                    order: order._id,
                    bookList: orderDetailArray
                });

                // Create order detail after books are retrieved
                newOrderDetail.save()

                // Update new book in booklist of user
                user.findById(req.body.userId).then(user => {
                    //check if that book is already in user's booklist
                    books.forEach(book => {
                        let isExist = false;
                        user.bookList.forEach(userBook => {
                            if (userBook._id.toString() === book._id.toString()) {
                                isExist = true;
                            }
                        });
                        if (!isExist) {
                            user.bookList.push(book);
                        }else{
                            res.status = 400;
                            res.json("Book already exists in your booklist");
                        }
                    });
                    user.save().then(user => {
                        res.status = 200;
                        res.json("Order successfully created");
                    }).catch(err => {
                        res.status = 500;
                        res.json("Internal Server Error");
                    });
                }).catch(err => {
                    res.status = 500;
                    res.json("Internal Server Error");
                });
            }).catch(err => {
                res.status = 500;
                res.json("Internal Server Error");
            });
        }).catch(err => {
            res.status = 500;
            res.json("Internal Server Error");
        });
    }

    getAllOrders(req, res, next) {
        order.find({}).populate('user').then((orders) => {
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

module.exports = new Order();