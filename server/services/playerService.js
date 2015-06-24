var enhancedPlayer = require(require('path').join(__dirname, '..', '..', 'lib', 'enhancedPlayer'));
var soundCloudService = require(require('path').join(__dirname, 'soundCloudService'));
var PlaylistModel = require('mongoose').model('Playlist');
var twitterConfig = require(require('path').join(__dirname, '..', '..', 'config', 'twitterConfig'));

module.exports = (function () {
    'use strict';

    function next() {
        enhancedPlayer.next();
    }

    function stop() {
        enhancedPlayer.stop();
    }

    function add(url) {
        soundCloudService.getSong(url, function (song) {
            enhancedPlayer.add(song);
        });
    }

    function dumpNotYetPlayedSongs(callback) {
        var playlist = {hashtag: twitterConfig.hashtag};
        PlaylistModel.findOneAndRemove(playlist, function (err) {
            if (err) {
                console.log('Mongoose error: ' + err)
            } else {
                dump(playlist, callback)
            }
        });
    }

    function dump(playlist, callback) {
        var Playlist = new PlaylistModel(playlist);
        enhancedPlayer.getNotYetPlayedSongsStream().each(function (song) {
            Playlist.songs.push({permaLinkUrl: song.permalink_url, votes: song.votes})
        });
        Playlist.save(function (err) {
            if (err) {
                console.log('Mongoose error: ' + err)
            } else {
                callback();
            }
        });
    }

    return {
        next: next,
        stop: stop,
        add: add,
        dumpNotYetPlayedSongs: dumpNotYetPlayedSongs
    }
}());