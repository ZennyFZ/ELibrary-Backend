const express = require('express');
const translateRouter = express.Router();
const translateController = require('../controllers/translateController');
const { isLogin } = require('../middleware/loginChecker');

translateRouter.post('/', isLogin , translateController.translateTheText);

module.exports = translateRouter;