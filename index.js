
var SoundcloudWrapper = require('./libs/soundcloud_wrapper');
var PlayerWrapper = require('./libs/player_wrapper');
var Server = require('./libs/server');


var sc = new SoundcloudWrapper();
var playerWrapper = new PlayerWrapper();
sc.init();

function urlReceivedCallback (url) {
 	console.log('Just received URL: \'', url, '\' for playback');
  sc.resolve(url, function(track_hash) {
    //Getting stream_url and track_data
    console.log("Added resolved URL: ", track_hash.stream_url)
    playerWrapper.addPlaylist(track_hash);
  }, function() {
    console.log("Invalid URL");
  });
}


var myServer = new Server(1337);
myServer.init(urlReceivedCallback);

myServer.start();
