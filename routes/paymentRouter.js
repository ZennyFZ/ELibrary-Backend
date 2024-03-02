const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');
const {isLogin} = require('../middleware/loginChecker');

//VNPay
paymentRouter.post('/payment', isLogin, paymentController.payment)
paymentRouter.post('/check-paid-vnpay', isLogin, paymentController.checkPaymentForVNPay)

//Google Pay
paymentRouter.post('/create-payment-intent', isLogin, paymentController.paymentByGooglePay)

//MoMo
paymentRouter.post('/momo', isLogin, paymentController.paymentByMoMo)
paymentRouter.post('/check-paid-momo', isLogin, paymentController.checkPaymentForMomo)

//ZaloPay
paymentRouter.post('/zalopay', isLogin, paymentController.paymentByZaloPay)
paymentRouter.post('/check-paid-zalopay', isLogin, paymentController.checkPaymentForZaloPay)

//VietQR
paymentRouter.post('/vietqr', isLogin, paymentController.paymentByVietQR)
paymentRouter.get('/check-paid-vietqr', isLogin, paymentController.checkPaidForVietQR)

module.exports = paymentRouter;