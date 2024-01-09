const express = require('express');
const summarizeRouter = express.Router();
const summarizeController = require('../controllers/summarizeController');
const { isLogin } = require('../middleware/loginChecker');

summarizeRouter.post('/', isLogin , summarizeController.summarizeTheText)

module.exports = summarizeRouter;