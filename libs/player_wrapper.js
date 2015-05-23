var Player = require('player');
var player;

function PlayerWrapper() {
	this.player_initialized = false;
	this.player = null;
}

PlayerWrapper.prototype.isInitialized = function () {
	return this.player_initialized;
}

PlayerWrapper.prototype.isPlaying = function () {
	return this.player.playing !== null;
}

PlayerWrapper.prototype.init = function() {
	if (this.isInitialized()) {
		return;
	}
	this.player_initialized = true;

	// Initialize with empty playlist.
	this.player = new Player([])
	// Enable streaming.
		.enable('stream')
		.on('error', this.player_errorHandler);
}

PlayerWrapper.prototype.add = function(uri) {
	if (!this.isInitialized()) {
		this.init();
	}

	this.player.add(uri);

	if (!this.isPlaying()) {
		this.player.play();
	}
}

PlayerWrapper.prototype.player_errorHandler = function(err) {
	console.log(err);
}

module.exports = PlayerWrapper;