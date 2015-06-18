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

    player.getIndexOfNextPlayingSong = function () {
        return player.history.length;
    };

    player.stop = function () {
        if (player.speaker) {
            player.speaker.readableStream.unpipe();
            player.speaker.Speaker.end();
            songEndTime = Date.now();
        }
    };

    player.playNextSong = function () {
        var indexOfNextPlayingSong = player.getIndexOfNextPlayingSong();
        var song = player._list[indexOfNextPlayingSong];
        if (song && song.streamable) {
            soundCloudService.getStreamUrl(song.stream_url, function (streamUrl) {
                song[player.options.src] = streamUrl;
                player.stop();
                player.play(indexOfNextPlayingSong);
                songEndTime = Date.now() + song.duration;
            });
        }
    };

    player.getSongFromPlaylist = function (songId) {
        return player._list[lazy(player._list).map(function (currentSong) {
            return currentSong.id
        }).indexOf(songId)];
    };

    player.isPlaying = function () {
        return songEndTime >= Date.now();
    };

    player.next = function () {
        player.playNextSong();
    };

    return player
})();