const express = require('express');
const path = require('path');
const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');

const config = require('./config').server;

const hooks = {
	index: require('./hooks/index'),
	travis: require('./hooks/travis'),
	slackbot: require('./hooks/slackbot'),
};

const app = express();

app.set('views', `${__dirname}/views`);

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('combined'));

// github webhook parser should be before body-parser
// https://github.com/rvagg/github-webhook-handler/issues/14#issuecomment-183141719
app.use('/tsg-slackbot', hooks.slackbot);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
	res.set('Access-Control-Allow-Origin', '*');
	return next();
});

app.use('/', hooks.index);
app.use('/travis', hooks.travis);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Requested resource is not found');
	err.status = 404;
	return next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	const status = err.status || 500;
	res.status(status);
	res.set('Content-Type', 'application/json');
	res.send(JSON.stringify({
		status,
		message: http.STATUS_CODES[status],
		error: err.message,
		stacktrace: {},
	}));
});

module.exports = app;
