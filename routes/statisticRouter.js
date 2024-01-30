const express = require('express');
const statisticRouter = express.Router();
const statisticController = require('../controllers/statisticController');
const {isAdmin} = require('../middleware/loginChecker');

statisticRouter.get('/books-sold', isAdmin, statisticController.getBooksSold);
statisticRouter.get('/total-customer', isAdmin, statisticController.getTotalCustomer);
statisticRouter.get('/total-revenue', isAdmin, statisticController.getTotalRevenue);

module.exports = statisticRouter;