const querystring = require('querystring');
const request = require('request');
const config = require('./config.js').twitter;

const APIBase = 'https://api.twitter.com/1.1/';
const streamBase = 'https://stream.twitter.com/1.1/';
const uploadBase = 'http://upload.twitter.com/1.1/';

const twitter = function (baseUrl, method, account, resource, params, callback) {
	const paramString = querystring.stringify(params)
		.replace(/\!/g, '%21')
		.replace(/\'/g, '%27')
		.replace(/\(/g, '%28')
		.replace(/\)/g, '%29')
		.replace(/\*/g, '%2A'); // f*cking twitter implementation

	return request({
		url: `${baseUrl + resource}.json` + `?${paramString}`,
		oauth: {
			consumer_key: config.oauth.consumer_key,
			consumer_secret: config.oauth.consumer_secret,
			token: config.oauth[account].oauth_token,
			token_secret: config.oauth[account].oauth_token_secret,
		},
		json: true,
		method,
	}, callback);
};

twitter.get = twitter.bind(this, APIBase, 'GET');
twitter.post = twitter.bind(this, APIBase, 'POST');
twitter.stream = twitter.bind(this, streamBase);
twitter.stream.get = twitter.bind(this, streamBase, 'GET');
twitter.stream.post = twitter.bind(this, streamBase, 'POST');

twitter.formUpload = function (baseUrl, account, resource, formData, callback) {
	return request({
		url: `${baseUrl + resource}.json`,
		oauth: {
			consumer_key: config.oauth.consumer_key,
			consumer_secret: config.oauth.consumer_secret,
			token: config.oauth[account].oauth_token,
			token_secret: config.oauth[account].oauth_token_secret,
		},
		json: true,
		method: 'POST',
		formData,
	}, callback);
};

twitter.uploadMedia = twitter.formUpload.bind(this, uploadBase);

module.exports = twitter;
