
var SoundcloudWrapper = require('./libs/soundcloud_wrapper');
var PlayerWrapper = require('./libs/player_wrapper');
var Server = require('./libs/server');

var soundcloudWrapper = new SoundcloudWrapper();
var playerWrapper = new PlayerWrapper();
soundcloudWrapper.init();

function urlReceivedCallback (url) {
	console.log('Received URL:' , url);
	soundcloudWrapper.resolve(url, function(track_hash) {
		// Getting resolve stream url (src) and track_data.
		console.log('Added resolved URL: ', track_hash.src)
		playerWrapper.addToPlaylist(track_hash);
  	}, function() {
		console.log("Invalid URL");
	});
}

var myServer = new Server(1337);
myServer.init(urlReceivedCallback);

myServer.start();
