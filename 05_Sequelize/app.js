var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs')
var rfs = require('rotating-file-stream')
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var logDirectory = path.join(__dirname, 'log')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
 
// create a rotating write stream
var accessLogStream = rfs.createStream("access.log", {
  size: "10M", // rotate every 10 MegaBytes written
  interval: "1d", // rotate daily
  compress: "gzip", // compress rotated files
  path: logDirectory
});
 
// setup the logger
app.use(logger('combined', { stream: accessLogStream }))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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