var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer'); 

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

function playURL(url) {

 	console.log('Just received URL: \'' + url + '\' for playback');

	// TODO play stuff

	return 'SUCCESS';
}

app.put('/play', function (req, res) {

	// echo body to client
 	console.log(req.body);
	console.log('-------');

	playURL(req.body.url);
 
 	res.json(req.body);
});

var server = app.listen(1337, function () {
  var port = server.address().port;

  console.log('Server running: http://localhost%s/play', port);

});