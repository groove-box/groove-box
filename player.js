var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer'); 

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

var SUCCESS = "success";
var FAILURE = "failure";

function playURL(url) {

	// TODO play stuff
 	console.log('Just received URL: ' + url + ' for playback');

	return SUCCESS;
}

app.get('/status', function (req, res) {
  res.send('Everything is OK!');
});

app.post('/play', function (req, res) {

	// echo body to client
 	console.log(req.body);
 	res.json(req.body);
});

var server = app.listen(1337, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s%s', host, port);

});