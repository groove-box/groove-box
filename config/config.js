var credentials = require('./credentials.json');

var config = {
	tweeter: {
		host: '127.0.0.1',
		port: 3000,
		path: '/tweet'
	}
};

config.credentials = credentials;

module.exports = config;