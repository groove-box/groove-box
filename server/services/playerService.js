var enhancedPlayer = require(require('path').join(__dirname, '..', '..', 'lib', 'enhancedPlayer'));
var soundCloudService = require(require('path').join(__dirname, 'soundCloudService'));
var PlaylistModel = require('mongoose').model('Playlist');
var twitterConfig = require(require('path').join(__dirname, '..', '..', 'config', 'twitterConfig'));
var Q = require('q');

module.exports = (function () {
    'use strict';

    function next() {
        enhancedPlayer.next();
    }

    function stop() {
        enhancedPlayer.stop();
    }

    function add(url) {
        soundCloudService.getSong(url).then(function (song) {
            enhancedPlayer.add(song);
        }).done();
    }

    function removePreviousDumpedSongsAndDumpNotYetPlayedSongs() {
        var playlist = PlaylistModel.where({hashtag: twitterConfig.hashtag});
        return playlist.findOneAndRemove().exec(function (err) {
            if (err) {
                console.log('Mongoose error: ' + err)
            }
        }).then(function () {
            return dumpNotYetPlayedSongs();
        });
    }

    function dumpNotYetPlayedSongs() {
        var deferred = Q.defer();
        var playlist = new PlaylistModel({
            hashtag: twitterConfig.hashtag,
            songs: getNotYetPlayedSongs()
        });
        playlist.save(function (err) {
            if (err) {
                console.log('Mongoose error: ' + err)
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    function getNotYetPlayedSongs() {
        var songs = [];
        enhancedPlayer.getNotYetPlayedSongsStream().each(function (song) {
            songs.push({permaLinkUrl: song.permalink_url, votes: song.votes})
        });
        return songs;
    }

    function restoreSongsFromDatabase() {
        var playlist = PlaylistModel.where({hashtag: twitterConfig.hashtag});
        playlist.findOne(function (err, playlist) {
            if (err) {
                console.log('Mongoose error: ' + err)
            } else {
                addRestoredSongs(playlist, 0);
            }
        });
    }

    function addRestoredSongs(playlist, songIndex) {
        var restoredSong = playlist.songs[songIndex];
        if (restoredSong) {
            soundCloudService.getSong(restoredSong.permaLinkUrl).then(function (song) {
                song.votes = restoredSong.votes;
                return enhancedPlayer.add(song);
            }).then(function () {
                var nextSongIndex = songIndex + 1;
                addRestoredSongs(playlist, nextSongIndex);
            }).done();
        }
    }

    return {
        next: next,
        stop: stop,
        add: add,
        removePreviousDumpedSongsAndDumpNotYetPlayedSongs: removePreviousDumpedSongsAndDumpNotYetPlayedSongs,
        restoreSongsFromDatabase: restoreSongsFromDatabase
    }
}());