var path = require('path');
var Player = require('player');
var twitterService = require(path.join(__dirname, 'twitterService'));
var soundcloudService = require(path.join(__dirname, 'soundcloudService'));
var util = require('util');
var fs = require('fs');
var config = require(path.join(__dirname, '..', '..', 'config', 'config.js'));

function PlayerService() {
    this.player_initialized = false;
    this.player = null;
    this.playlist = [];
    this.history = [];
    this.twitterService = twitterService;
    this.soundcloudService = new soundcloudService();
}

PlayerService.prototype.init = function () {
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
            .on('playing', function () {
                self.playStartHandler.apply(self, arguments);
            })
            .on('playend', function () {
                self.playEndHandler.apply(self, arguments);
            });

    this.player.next = function () {
    };

    //this.loadPlaylist();
};

PlayerService.prototype.errorHandler = function (err) {
    this.stop();
    console.log(err);
};

PlayerService.prototype.playStartHandler = function (item) {
    var status = util.format(
            'Currently playing: %s. Check it out: %s',
            item.track_data.title,
            item.track_data.permalink_url
    );
    this.twitterService.tweet(status);
};

PlayerService.prototype.playEndHandler = function (item) {
    item.played++;
    item.finished = true;
    this.playNextTrack();
};

PlayerService.prototype.isInitialized = function () {
    return this.player_initialized;
};

PlayerService.prototype.isPlaying = function () {
    var currentTrack = this.getCurrentTrack();

    var result = !!currentTrack && (currentTrack.finished === false);

    return result;
};

PlayerService.prototype.getCurrentTrack = function () {
    var result = this.player.playing;

    return result;
};

PlayerService.prototype.getNextTrack = function () {
    var nextTrackIndex = this.getNextTrackIndex();

    var result = this.player._list[nextTrackIndex];

    return result;
};

PlayerService.prototype.getCurrentTrackIndex = function () {
    return (this.getNextTrackIndex() - 1);
};

PlayerService.prototype.getNextTrackIndex = function () {
    return this.player.history.length;
};

PlayerService.prototype.next = function () {
    this.init();

    var wasPlaying = this.isPlaying();

    this.stop();

    // Only call this if the player is not running. We have the 'playend'
    // handler for triggering next tracks.
    if (!wasPlaying) {
        this.playNextTrack();
    }
};

PlayerService.prototype.stop = function () {
    this.init();

    if (this.isPlaying()) {
        this.player.stop();
    }
};

PlayerService.prototype.play = function () {
    this.init();

    if (!this.isPlaying()) {
        this.player.play();
    }
};

PlayerService.prototype.add = function (data) {
    if (!this.isInitialized()) {
        this.init();
    }

    var self = this;

    this.player.add(data);

    if (!this.isPlaying()) {
        this.playNextTrack()
    }
};

PlayerService.prototype.addToPlaylist = function (data) {
    if (!this.isInitialized()) {
        this.init();
    }

    var playlistItem = this.getPlaylistItem(data);
    var is_new_entry = !playlistItem;
    if (is_new_entry) {
        playlistItem = this._generateNewPlaylistItem(data);
    }
    else {
        playlistItem.votes++;
        playlistItem.finished = false;
    }

    if (is_new_entry) {
        this.add(playlistItem);
    }
    else {
        this._sortPlaylistByVotes();
    }
    this.outputPlaylist();
};

PlayerService.prototype.outputPlaylist = function () {
    for (var i = 0; i < this.player._list.length; i++) {
        var cur = this.player._list[i];
        console.log((i + 1) + '. votes: ' + cur.votes + ' title: ' + cur.track_data.title);
    }
};

PlayerService.prototype.prepareNextTrack = function (callback) {
    var nextTrack = this.getNextTrack();

    this.prepareTrack(nextTrack, callback);
};

PlayerService.prototype.prepareTrack = function (item, callback) {
    var self = this;

    if (item && item.track_data.streamable) {
        this.soundcloudService.resolveStreamUrl(item.track_data.stream_url, function (resolved_stream_url) {
            item[self.player.options.src] = resolved_stream_url;

            if (callback) {
                callback.apply(self);
            }
        });
    }
    // @COMMENT: I guess this is bad, but currently it just works.
    else if (callback) {
        callback.apply(self);
    }
};

PlayerService.prototype.playNextTrack = function () {
    this.prepareNextTrack(
            function () {
                this._playerNext();
            }
    );
};

PlayerService.prototype._playerNext = function () {
    var nextTrackIndex = this.getNextTrackIndex();
    var player = (this._list) ? this : this.player;

    if (nextTrackIndex >= player._list.length) {
        player.emit('error', 'No next song was found');
        player.emit('finish', player.playing);
        return player;
    }

    player.stop();
    player.play(nextTrackIndex);

    return player;
};

PlayerService.prototype.getPlaylistItem = function (data) {
    var result;

    for (var i = 0; i < this.player._list.length; i++) {
        var cur = this.player._list[i];
        if (cur.track_data.id === data.track_data.id) {
            result = cur;
            break;
        }
    }

    return result;
};

PlayerService.prototype._generateNewPlaylistItem = function (data) {
    var result = data;

    result.finished = false;
    result.played = 0;
    result.votes = 1;

    return result;
};

PlayerService.prototype._sortPlaylistByVotes = function () {
    var playlist = this.player._list;
    if (playlist.length > 1) {
        var nextTrackIndex = this.getNextTrackIndex();
        // Get actual sortable part of the playlist.
        var sortablePlaylistPart = playlist.slice(nextTrackIndex);

        if (sortablePlaylistPart.length > 0) {
            sortablePlaylistPart.sort(this._sortPlaylistByVotesCallback);

            var parametersForSplice = sortablePlaylistPart;
            parametersForSplice.unshift(nextTrackIndex, playlist.length);

            Array.prototype.splice.apply(
                    playlist,
                    parametersForSplice
            );
        }
    }
};

PlayerService.prototype._sortPlaylistByVotesCallback = function (a, b) {
    var result = 0;
    // We are sorting descending here, so the numbers are reversed.
    if (a.votes > b.votes) {
        result = -1;
    }
    else if (a.votes < b.votes) {
        result = 1;
    }

    return result;
};

PlayerService.prototype.dump = function () {
    return this;
};

PlayerService.prototype.savePlaylist = function () {
    this.init();

    fs.writeFileSync(config.playerService.playlistLocation, JSON.stringify(this.player._list));
};

PlayerService.prototype.loadPlaylist = function () {
    var fileContent = fs.readFileSync(config.playerService.playlistLocation);

    if (fileContent) {
        var playlist = JSON.parse(fileContent);

        if (playlist) {
            for (var i in playlist) {
                var cur = playlist[i];

                if (cur[this.player.options.src]) {
                    delete cur[this.player.options.src];
                }
            }

            this.player._list = playlist;
        }
    }
};

module.exports = PlayerService;
