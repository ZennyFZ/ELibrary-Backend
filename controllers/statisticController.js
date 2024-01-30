const order = require('../models/order');
const orderDetail = require('../models/orderDetail');
const user = require('../models/user');

class statisticController {

    getBooksSold(req, res, next) {
        orderDetail.find({}).then((odetail) => {
            let bookSold = 0;
            odetail.forEach(odetailData => {
                bookSold += odetailData.bookList.length
            })
            res.status(200)
            res.json({
                bookSold
            })
        }).catch(err => {
            res.status(500)
            res.json("Internal Server Error")
        });
    }

    getTotalCustomer(req, res, next) {
        let totalCustomer = 0;
        user.find({}).then((userDataArray) => {
            userDataArray.forEach(userData => {
                if(userData.bookList.length > 0){
                    totalCustomer += 1
                }
            })
            res.status(200)
            res.json({
                totalCustomer
            })
        }).catch(err => {
            res.status(500)
            res.json("Internal Server Error")
        })
    }

    getTotalRevenue(req, res, next) {
        const year = req.query.year;
        let totalRevenueArray = [0,0,0,0,0,0,0,0,0,0,0,0];
        order.find({}).then((orderDataArray) => {
            orderDataArray.forEach(orderData => {
                for (let i = 0; i < totalRevenueArray.length; i++) {
                    if (orderData.orderDate.getMonth() == i && orderData.orderDate.getFullYear() == year){
                        totalRevenueArray[i] += orderData.totalPrice
                    }
                }
            })
            res.status(200)
            res.json({
                totalRevenueArray
            })
        }).catch(err => {
            res.status(500)
            res.json("Internal Server Error")
        })
    }

}

module.exports = new statisticController();