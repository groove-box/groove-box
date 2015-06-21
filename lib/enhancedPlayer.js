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

    function addToPlaylist(song) {
        player.add(song)
    }

    function getIndexOfNextPlayingSong() {
        return player.history.length;
    }

    function getSong(songId) {
        return player._list[lazy(player._list).map(function (song) {
            return song.id
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

    function sortNotPlayedSongsDescendingByVotes() {
        var playlist = player._list;
        var indexOfNextPlayingSong = getIndexOfNextPlayingSong();
        player._list = lazy(playlist).initial(playlist.length -
                indexOfNextPlayingSong).concat(lazy(playlist).slice(indexOfNextPlayingSong).sortBy(function (song) {
            return song.votes;
        }, true)).toArray();
    }

    function logPlaylist() {
        player._list.forEach(function (currentSong, index) {
            console.log(index + 1 + '. votes: ' + currentSong.votes + ' title: ' + currentSong.title);
        });
    }

    return {
        addToPlaylist: addToPlaylist,
        getSong: getSong,
        next: player.next,
        stop: player.stop,
        playNextSong: playNextSong,
        isPlaying: isPlaying,
        sortNotPlayedSongsDescendingByVotes: sortNotPlayedSongsDescendingByVotes,
        logPlaylist: logPlaylist
    }
})();