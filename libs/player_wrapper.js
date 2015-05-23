var Player = require('player');
var Tweeter = require('./tweeter');
var player;

function PlayerWrapper() {
	this.player_initialized = false;
	this.player = null;
	this.playlist = [];
	this.playlistData = {};
	this.history = [];
	this.tweeter = new Tweeter();
}

PlayerWrapper.prototype.errorHandler = function(err) {
	console.log(err);
}

PlayerWrapper.prototype.playStartHandler = function(uri) {
	var playlistData = this.getPlayListData(uri);

	if (playlistData) {
		this.tweeter.tweet(playlistData.track_data.title, playlistData.track_data.permalink_url);
	}
}

PlayerWrapper.prototype.playEndHandler = function(uri) {
	var playlistData = this.getPlayListData(uri);

	playlistData.played++;

	// Remove the entry here, because we do not want it to be in the playlist
	// again. But since we are not adding the new sorted playlist yet, we do
	// not need to remove the entry here.
	this._removeEntryFromPlaylist(uri);
	// @TODO: Re-apply the list to the player.
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
	var self = this;

	// Initialize with empty playlist.
	this.player = new Player([])
	// Enable streaming.
		.enable('stream')
		.on('error', this.errorHandler)
		.on('playing', function() {
			self.playStartHandler.apply(self, arguments);
		})
		.on('playend', function() {
			self.playEndHandler.apply(self, arguments);
		});
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

PlayerWrapper.prototype.addToPlaylist = function(data) {
	var playlistData = this.getPlayListData(data.stream_url);
	var is_new_entry = false;
	if (!playlistData) {
		playlistData = this._generateNewPlaylistItem(data);
		is_new_entry = true
	}
	else {
		// @TODO: Fixme. This is not working or it is not reaching here.
		playlistData.votes++;
	}

	this.playlist.push(playlistData.stream_url);
	// @TODO: Fixme. Hash the stream url with sha1.
	this.playlistData[playlistData.stream_url] = playlistData;

	this.add(playlistData.stream_url);
	console.log(playlistData);

	this._sortPlaylistByVotes();

	// @TODO: Re-apply the list to the player.
}

PlayerWrapper.prototype.getPlayListData = function(stream_url) {
	var result;

	for (var i = 0; i < this.playlistData.length; i++) {
		var cur = this.playlist[i];

		if (cur.stream_url === stream_url) {
			result = cur;
			break;
		}
	}

	return result;
}

PlayerWrapper.prototype._generateNewPlaylistItem = function(data) {
	var result = data;

	result.votes = 1;
	result.played = 0;

	return result;
}

PlayerWrapper.prototype._sortPlaylistByVotes = function() {
	this.playlist.sort(this._sortPlaylistByVotesCallback.apply(this));
}

PlayerWrapper.prototype._sortPlaylistByVotesCallback = function(a, b) {
	var result = 0;
	var a_playlistData = this.getPlayListData(a);
	var b_playlistData = this.getPlayListData(b);

	if (a_playlistData && b_playlistData) {
		// We are sorting descending here, so the numbers are reversed.
		if (a_playlistData.votes > b_playlistData.votes) {
			result = -1;
		}
		else if(a_playlistData.votes < b_playlistData.votes) {
			result = 1;
		}
	}

	return result;
}

PlayerWrapper.prototype._removeEntryFromPlaylist = function(stream_url) {
	var playlistData = this.getPlayListData(stream_url);

	this.playlist.filter(this._removeEntryFromPlaylistCallback, playlistData);
}

PlayerWrapper.prototype._removeEntryFromPlaylistCallback = function(index, value, targetArray) {
	result = (this.stream_url !== value);

	return result;
}

module.exports = PlayerWrapper;