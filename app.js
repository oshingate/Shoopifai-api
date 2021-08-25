var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

// importing routers

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var productRouter = require('./routes/product');

//imports
const mongoose = require('mongoose');

var app = express();
//databvase connection
mongoose.connect(
  'mongodb://localhost:27017/capstone-1',
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    console.log('mongodb connected ?', err ? false : true);
  }
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes handler

app.use('/api/v1', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/product', productRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
