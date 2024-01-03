const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose  = require('mongoose');

const bookRouter = require('./routes/bookRouter');
const userRouter = require('./routes/userRouter');
const summarizeRouter = require('./routes/summarizeRouter')

const app = express();
require('dotenv').config()

const url = process.env.DATABASE_CONNECTION_URI
const connect = mongoose.connect(url)
connect.then((db)=>{
  console.log("Connected to the Database");
}).catch((err)=>{
  console.log(err);
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiPath = "/api/v1"
app.use(`${apiPath}/book`, bookRouter);
app.use(`${apiPath}/user`, userRouter);
app.use(`${apiPath}/summarize`, summarizeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({"error": err.message});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
