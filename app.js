var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var bodyParser = require('body-parser');

var config = require('./config').server;

var hooks = {
    index: require('./hooks/index'),
    travis: require('./hooks/travis'),
};

var app = express();

app.set('views', __dirname + '/views');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    return next();
});

app.use('/', hooks.index);
app.use('/travis', hooks.travis);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Requested resource is not found');
    err.status = 404;
    return next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    var status = err.status || 500;
    res.status(status);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({
        status: status,
        message: http.STATUS_CODES[status],
        error: err.message,
        stacktrace: {}
    }));
});

module.exports = app;
