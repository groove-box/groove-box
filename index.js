
var SoundcloudWrapper = require('./libs/soundcloud_wrapper');
var PlayerWrapper = require('./libs/player_wrapper');
var Server = require('./libs/server');


var sc = new SoundcloudWrapper();
var playerWrapper = new PlayerWrapper();
sc.init();

function urlReceivedCallback (url) {
 	console.log('Just received URL: \'', url, '\' for playback');
  sc.resolve(url, function(mp3Url) {
    console.log("Added resolved URL: ", mp3Url)
    playerWrapper.add(mp3Url);
  });
}


var myServer = new Server(1337);
myServer.init(urlReceivedCallback);

myServer.start();
