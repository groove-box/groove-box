var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer'); 

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

var callbackFunction = null;

function postHandler (req, res) {

	// echo body to client
 	console.log(req.body);
	console.log('-------');

	callbackFunction(req.body.url)
 
 	res.json(req.body);
}

app.post('/play', postHandler);

function Server(runPort) { 
	this.port = runPort;
}

Server.prototype.init = function(callback) {

	callbackFunction = callback;
}

Server.prototype.start = function() {

	var server = app.listen(this.port, function () {
	  var port = server.address().port;

	  console.log('Server running: http://localhost%s/play', port);

	});
}

Server.prototype.player_errorHandler = function(err) {
        console.log(err);
}

module.exports = Server;