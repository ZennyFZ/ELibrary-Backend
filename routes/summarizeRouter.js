const express = require('express');
const summarizeRouter = express.Router();
const summarizeController = require('../controllers/summarizeController');

summarizeRouter
.route('/')
.post(summarizeController.summarizeTheText)

module.exports = summarizeRouter;