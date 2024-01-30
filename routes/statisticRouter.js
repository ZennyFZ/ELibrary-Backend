const express = require('express');
const statisticRouter = express.Router();
const statisticController = require('../controllers/statisticController');
const {isLogin, isAdmin} = require('../middleware/loginChecker');

statisticRouter.get('/books-sold', isLogin, isAdmin, statisticController.getBooksSold);
statisticRouter.get('/total-customer', isLogin, isAdmin, statisticController.getTotalCustomer);
statisticRouter.get('/total-revenue', isLogin, isAdmin, statisticController.getTotalRevenue);

module.exports = statisticRouter;