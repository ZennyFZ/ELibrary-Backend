const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');
const {isLogin} = require('../middleware/loginChecker');

paymentRouter.post('/payment', isLogin, paymentController.payment)

module.exports = paymentRouter;