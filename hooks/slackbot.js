const createHandler = require('github-webhook-handler');
const config = require('../config').hooks.slackbot;

const handler = createHandler({
	path: '/',
	secret: config.token,
});

handler.on('error', (error) => {
	console.error(error);
});

handler.on('ping', (event) => {
	console.log(event);
});

handler.on('push', (event) => {
	console.log(event);
});

module.exports = handler;
