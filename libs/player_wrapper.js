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

PlayerWrapper.prototype.errorHandler = function(err) {
	console.log(err);
}

PlayerWrapper.prototype.playStartHandler = function(item) {
	this.tweeter.tweet(item.track_data.title, item.track_data.permalink_url);
}

PlayerWrapper.prototype.playEndHandler = function(item) {
	item.played++;
	item.finished = true;

	// Remove the entry here, because we do not want it to be in the playlist
	// again. But since we are not adding the new sorted playlist yet, we do
	// not need to remove the entry here.
	this._removeEntryFromPlaylist(item);
	// @TODO: Re-apply the list to the player.
}

PlayerWrapper.prototype.isInitialized = function () {
	return this.player_initialized;
}

PlayerWrapper.prototype.isPlaying = function () {
	var currentTrack = this.player.playing;

	var result = !!currentTrack && (currentTrack.finished === false);

	return result;
}

PlayerWrapper.prototype.getNextTrackIndex = function() {
	return this.player.history.length;
}

PlayerWrapper.prototype.add = function(data) {
	if (!this.isInitialized()) {
		this.init();
	}

	this.player.add(data);

	// @TODO: Fixme. If the player finished a file and is idle
	// and a new song is pushed, this does either not trigger at
	// and if plays the whole playlist again.
	if (!this.isPlaying()) {
		var nextTrackIndex = this.getNextTrackIndex();
		this.player.play(nextTrackIndex);
	}
}

PlayerWrapper.prototype.addToPlaylist = function(data) {
	if (!this.isInitialized()) {
		this.init();
	}

	var playlistItem = this.getPlaylistItem(data);
	var is_new_entry = !playlistItem;
	if (is_new_entry) {
		playlistItem = this._generateNewPlaylistItem(data);
	}
	else {
		// @TODO: Fixme. This is not working or it is not reaching here.
		playlistItem.votes++;
		playlistItem.finished = false;
	}

	this.add(playlistItem);

	this._sortPlaylistByVotes();

	// @TODO: Re-apply the list to the player.
}

PlayerWrapper.prototype.getPlaylistItem = function(data) {
	var result;

	for (var i = 0; i < this.player._list.length; i++) {
		var cur = this.player._list[i];

		if (cur.track_data.id === data.track_data.id) {
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
	result.finished = false;

	return result;
}

PlayerWrapper.prototype._sortPlaylistByVotes = function() {
	// @TODO: Fixme.
	// this.playlist.sort(this._sortPlaylistByVotesCallback.apply(this));
}

PlayerWrapper.prototype._sortPlaylistByVotesCallback = function(a, b) {
	// We are sorting descending here, so the numbers are reversed.
	if (a_playlistData.votes > b_playlistData.votes) {
		result = -1;
	}
	else if(a_playlistData.votes < b_playlistData.votes) {
		result = 1;
	}

	return result;
}

PlayerWrapper.prototype._removeEntryFromPlaylist = function(item) {
	// @TODO: Fixme.
	// this.playlist.filter(this._removeEntryFromPlaylistCallback, playlistData);
}

PlayerWrapper.prototype._removeEntryFromPlaylistCallback = function(index, value, targetArray) {
	result = (this.stream_url !== value);

	return result;
}

module.exports = PlayerWrapper;