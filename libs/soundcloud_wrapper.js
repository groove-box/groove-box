var https = require('https');
SC = require('soundcloud-nodejs-api-wrapper');

var request = require('request');
var config = require('../config/config.json');
var sc;
var access_token;
var client;

function SoundcloudWrapper() {
  this.sc = null;
  this.access_token = null;
  this.client = null;
}

SoundcloudWrapper.prototype.init = function() {
  var sc = new SC({
    client_id :     config.client_id,
    client_secret : config.client_secret,
    username :      config.username,
    password:       config.password
  });

  var client = sc.client();

  client.exchange_token(function(err, result) {
    this.access_token = arguments[3].access_token;
  });

  this.client = sc.client({access_token : this.access_token});
}

SoundcloudWrapper.prototype.resolve = function(resolveUrl, callback, error) {
  this.client.get('/resolve', { url: resolveUrl }, function(err, result) {
    console.log("TEST: ",typeof result == "undefined");
    if (typeof result == "undefined") {
      error();
    } else {
      https.get(result.location, function(res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function (chunk) {
          body += chunk;
        });
        res.on('end', function () {
          var song = JSON.parse(body);
          request(song.stream_url + '?client_id=' + config.client_id, function (error, response, body) {
            callback({ stream_url: response['request'].uri.href, track_data: song});
          });
        });
      });
    }
  });
}



module.exports = SoundcloudWrapper;
