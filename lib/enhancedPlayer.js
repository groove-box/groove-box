var path = require('path');
var Player = require('player');
var twitterService = require(path.join(__dirname, '..', 'server', 'services', 'twitterService'));
var soundCloudService = require(path.join(__dirname, '..', 'server', 'services', 'soundCloudService'));
var lazy = require('lazy.js');

module.exports = (function () {
    'use strict';

    var songEndTime = Date.now();

    var player = new Player([]).enable('stream')
            .on('error', function (err) {
                player.stop();
                console.log(err);
            })
            .on('playing', function (song) {
                twitterService.tweet('Currently playing: ' + song.title + '. Check it out: ' + song.permalink_url);
            });

    player.next = function () {
        playNextSong();
    };

    player.stop = function () {
        if (player.speaker) {
            player.speaker.readableStream.unpipe();
            player.speaker.Speaker.end();
            songEndTime = Date.now();
        }
    };

    function getIndexOfNextPlayingSong() {
        return player.history.length;
    }

    function getSong(songId) {
        var playlist = player._list;
        return playlist[lazy(playlist).map(function (currentSong) {
            return currentSong.id
        }).indexOf(songId)];
    }

    function playNextSong() {
        var indexOfNextPlayingSong = getIndexOfNextPlayingSong();
        var song = player._list[indexOfNextPlayingSong];
        if (song && song.streamable) {
            soundCloudService.getStreamUrl(song.stream_url, function (streamUrl) {
                song[player.options.src] = streamUrl;
                player.stop();
                player.play(indexOfNextPlayingSong);
                songEndTime = Date.now() + song.duration;
            });
        }
    }

    function isPlaying() {
        return songEndTime >= Date.now();
    }

    return {
        playlist: player._list,
        getIndexOfNextPlayingSong: getIndexOfNextPlayingSong,
        getSong: getSong,
        next: player.next,
        stop: player.stop,
        playNextSong: playNextSong,
        isPlaying: isPlaying
    }
})();