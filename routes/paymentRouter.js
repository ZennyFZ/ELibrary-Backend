const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');
const {isLogin} = require('../middleware/loginChecker');

paymentRouter.post('/payment', isLogin, paymentController.payment)
paymentRouter.post('/create-payment-intent', isLogin, paymentController.paymentByGooglePay)

module.exports = paymentRouter;