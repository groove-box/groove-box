var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

var postCallback = null;
var nextCallback = null;
var dumpCallback = null;
var stopCallback = null;

function Server(runPort) {
	this.port = runPort;
}

Server.prototype.init = function(urlCallback, nextReceivedCallback, stopReceivedCallback, dumpReceivedCallback) {

	postCallback = urlCallback;
	nextCallback = nextReceivedCallback;
	stopCallback = stopReceivedCallback;
	dumpCallback = dumpReceivedCallback;
}

Server.prototype.nextHandler =  function(req, res) {

	nextCallback();
	res.end();
}

Server.prototype.stopHandler =  function(req, res) {
	stopCallback();
	res.end();
}

Server.prototype.postHandler =  function(req, res) {

	// echo body to client
 	console.log(req.body);
	console.log('-------');

	postCallback(req.body.url)

 	res.json(req.body);
}

Server.prototype.dumpHandler =  function(req, res) {
	var result = dumpCallback();

	res.json(result);
}

app.get('/next', Server.prototype.nextHandler);
app.get('/stop', Server.prototype.stopHandler);
app.get('/dump', Server.prototype.dumpHandler);
app.post('/play', Server.prototype.postHandler);

Server.prototype.start = function(callback) {

	var server = app.listen(this.port, function () {
	  var port = server.address().port;

	  console.log('Server running: http://localhost:%s/play', port);

	  if (callback) {
		callback();
	  }

	});
}

Server.prototype.player_errorHandler = function(err) {
	console.log(err);
}


module.exports = Server;