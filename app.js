const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose  = require('mongoose');
const cors = require('cors');

const bookRouter = require('./routes/bookRouter');
const categoryRouter = require('./routes/categoryRouter');
const userRouter = require('./routes/userRouter');
const summarizeRouter = require('./routes/summarizeRouter')
const translateRouter = require('./routes/translateRouter')
const paymentRouter = require('./routes/paymentRouter')
const orderRouter = require('./routes/orderRouter')
const statisticRouter = require('./routes/statisticRouter')

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
app.use(cors({
  origin: ['https://e-library-frontend-delta.vercel.app', 'http://e-library-frontend-delta.vercel.app', 'http://localhost:5173', 'https://elibrary.io.vn', 'http://elibrary.io.vn'], // Replace with the actual origin of your client application
  credentials: true
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiPath = "/api/v1"
app.use(`${apiPath}/book`, bookRouter);
app.use(`${apiPath}/category`, categoryRouter);
app.use(`${apiPath}/user`, userRouter);
app.use(`${apiPath}/summarize`, summarizeRouter);
app.use(`${apiPath}/translate`, translateRouter);
app.use(`${apiPath}/payment`, paymentRouter);
app.use(`${apiPath}/order`, orderRouter);
app.use(`${apiPath}/statistic`, statisticRouter);

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
