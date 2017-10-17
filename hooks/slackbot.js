const createHandler = require('github-webhook-handler');
const config = require('../config').hooks.slackbot;

const handler = createHandler({
	path: '/',
	secret: config.token,
});

handler.on('error', (error) => {
	console.error(error);
});

handler.on('push', (event) => {
	console.log(event);
});

module.exports = handler;
