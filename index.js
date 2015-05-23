
var SoundcloudWrapper = require('./libs/soundcloud_wrapper');
var PlayerWrapper = require('./libs/player_wrapper');
var Server = require('./libs/server');


var sc = new SoundcloudWrapper();
var playerWrapper = new PlayerWrapper();
sc.init();

function urlReceivedCallback (url) {
 	console.log('Just received URL: \'', url, '\' for playback');
  sc.resolve(url, function(track_hash) {
    console.log("Added resolved URL: ", track_hash)
    playerWrapper.addPlaylist(track_hash);
  });
}


var myServer = new Server(1337);
myServer.init(urlReceivedCallback);

myServer.start();
