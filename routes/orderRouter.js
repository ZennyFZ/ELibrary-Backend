const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController');
const {isLogin, isAdmin} = require('../middleware/loginChecker');

orderRouter.post('/create-order', isLogin, orderController.createOrder);
orderRouter.get('/get-all-orders', isLogin, isAdmin, orderController.getAllOrders);
orderRouter.post('/get-order', isLogin, orderController.getOrderByUserId);
orderRouter.get('/get-order-detail/:id', isLogin, orderController.getOrderDetailByOrderId);

module.exports = orderRouter;