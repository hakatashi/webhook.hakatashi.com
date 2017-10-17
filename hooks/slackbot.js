const createHandler = require('github-webhook-handler');
const {exec} = require('child_process');
const {promisify} = require('util');
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

handler.on('push', async (event) => {
	console.log(event);
	const branch = event.payload.ref.split('/').pop();
	if (event.payload.repository.name === 'slackbot' && branch === 'master') {
		console.log('Hooking slackbot...');
		const {stdout, stderr} = await promisify(exec)('cd /home/hakatashi/slackbot && node deploy.js');
		console.log('Hooked slackbot.');
		console.log(`stdout:\n${stdout}\n`);
		console.log(`stderr:\n${stderr}\n`);
	}
});

module.exports = handler;
