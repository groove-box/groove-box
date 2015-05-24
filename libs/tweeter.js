var querystring = require('querystring');
var http = require('http');
var config = require('../config/config');

function Tweeter(tohost, topath, toport) {
  this.host = config.tweeter.host;
  this.port = config.tweeter.port;
  this.path = config.tweeter.path;
}

Tweeter.prototype.tweet = function (status, callback) {
  // Build the post string from an object
  var post_data = querystring.stringify({
      'status': status
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: this.host,
      port: this.port,
      path: this.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
      }
  };

  // Set up the request
  var post_req = http
    .request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response from groovebox_tweeter: ' + chunk);
      });
    })
    .on('error', function(err) {
      console.log('Tweeter error: ', err);
      console.log('Initial status: ', status);
    })
    .on('close', function() {
      if (callback) {
        callback();
      }
    });

  // post the data
  post_req.write(post_data);
  post_req.end();
}

module.exports = Tweeter;