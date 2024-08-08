var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var indexRouter = require('./routes/index');


const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const registerRouter = require('./routes/register')
const approvedRouter = require('./routes/approve')
const loginRouter = require('./routes/login')
// const verfyToken = require('./middleware/jwt_decode')
const cors = require('cors')
const mongoose = require('mongoose');
const { DB_HOST, DB_PORT, DB_NAME } = process.env

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  console.log("Mongodb connected")

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/api/v1/products", productRouter)
app.use("/api/v1/order", orderRouter)
app.use("/api/v1/login", loginRouter)
app.use("/api/v1/register", registerRouter)
app.use("/api/v1/approve", approvedRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
