const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');
const {isLogin} = require('../middleware/loginChecker');

paymentRouter.post('/payment', isLogin, paymentController.payment)
paymentRouter.post('/create-payment-intent', isLogin, paymentController.paymentByGooglePay)
paymentRouter.post('/momo', isLogin, paymentController.paymentByMoMo)
paymentRouter.post('/zalopay', isLogin, paymentController.paymentByZaloPay)
paymentRouter.post('/vietqr', isLogin, paymentController.paymentByVietQR)
paymentRouter.get('/check-paid-vietqr', isLogin, paymentController.checkPaidForVietQR)

module.exports = paymentRouter;