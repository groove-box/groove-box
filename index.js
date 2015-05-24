
var SoundcloudWrapper = require('./libs/soundcloud_wrapper');
var PlayerWrapper = require('./libs/player_wrapper');
var Server = require('./libs/server');
var Tweeter = require('./libs/tweeter');
var tweeter = new Tweeter();
var soundcloudWrapper = new SoundcloudWrapper();
var playerWrapper = new PlayerWrapper();
soundcloudWrapper.init();

function urlReceivedCallback (url) {
	console.log('Received URL:' , url);
	soundcloudWrapper.resolvePermaLinkUrl(url, function(track_hash) {
		// Getting resolve stream url (src) and track_data.
		console.log('Added SoundCloud Track: ', track_hash.track_data.id)
		playerWrapper.addToPlaylist(track_hash);
  	}, function() {
		console.log("Invalid URL");
	});
}

function triggerStartTweet() {
	tweeter.tweet('Starting to party now! Suggest songs now with our hashtags now!');
}

function triggerEndTweet(callback) {
	tweeter.tweet('Party is over! Go home. Be safe! DDaD!', callback);
}

var myServer = new Server(1337);
myServer.init(urlReceivedCallback);

myServer.start(triggerStartTweet);

process.on('SIGINT', function() {
	triggerEndTweet(function() {
		process.exit();
	});
});