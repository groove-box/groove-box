var https = require('https');
SC = require('soundcloud-nodejs-api-wrapper');

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

SoundcloudWrapper.prototype.resolve = function(resolveUrl, callback) {
  this.client.get('/resolve', { url: resolveUrl }, function(err, result) {
    https.get(result.location, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        if(chunk != undefined) {
          callback(JSON.parse(chunk));
        }
      });
    });
  });
}

module.exports = SoundcloudWrapper;
