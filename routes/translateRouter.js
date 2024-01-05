const express = require('express');
const translateRouter = express.Router();
const translateController = require('../controllers/translateController');

translateRouter.post('/', translateController.translateTheText);

module.exports = translateRouter;