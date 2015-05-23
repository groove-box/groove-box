var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

function Tweeter(tohost, topath, toport) {
  this.host = tohost;
  this.path = topath;
  this.port = toport;
}

Tweeter.prototype.tweet = function (title, url) {

  // Build the post string from an object
  var post_data = querystring.stringify({
      'title' : "'" + title + "'",
      'url': "'" + url + "'"
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
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response from groovebox_tweeter: ' + chunk);
      });
  });

Tweeter.prototype.player_errorHandler = function(err) {
        console.log(err);
}
  // post the data
  post_req.write(post_data);
  post_req.end();
}

module.exports = Tweeter;