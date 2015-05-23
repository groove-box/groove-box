
var SoundcloudWrapper = require('./libs/soundcloud_wrapper');
var PlayerWrapper = require('./libs/player_wrapper');
var Server = require('./libs/server');

var config = require('./config/config.json');
var request = require('request');

var sc = new SoundcloudWrapper();
var playerWrapper = new PlayerWrapper();
sc.init();

function urlReceivedCallback (url) {
 	console.log('Just received URL: \'' + url + '\' for playback');
  sc.resolve(url, function(resolvedObject) {
    request(resolvedObject.stream_url + '?client_id=' + config.client_id, function (error, response, body) {
      playerWrapper.add(response['request'].uri.href);
    });
  });
}


var myServer = new Server(1337);
myServer.init(urlReceivedCallback);

myServer.start();
