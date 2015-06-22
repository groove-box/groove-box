var path = require('path');
var Player = require('player');
var twitterService = require(path.join(__dirname, '..', 'server', 'services', 'twitterService'));
var soundCloudService = require(path.join(__dirname, '..', 'server', 'services', 'soundCloudService'));

module.exports = (function () {
    'use strict';

    var songEndTime = Date.now();

    var player = new Player([]).enable('stream').on('error', function (err) {
        player.stop();
        console.log('Player error: ' + err);
    });

    var enhancedPlayerHelper = require(path.join(__dirname, 'helper', 'enhancedPlayerHelper'))(player);

    player.next = function () {
        var indexOfNextPlayingSong = enhancedPlayerHelper.getIndexOfNextPlayingSong();
        var song = player._list[indexOfNextPlayingSong];
        if (song && song.streamable) {
            soundCloudService.getStreamUrl(song.stream_url, function (streamUrl) {
                song[player.options.src] = streamUrl;
                player.stop();
                player.play(indexOfNextPlayingSong);
                songEndTime = Date.now() + song.duration;
                //TODO maybe move this to another layer
                twitterService.tweet('Currently playing: ' + song.title + '. Check it out: ' + song.permalink_url);
            });
        } else {
            console.log('Player error: No next song found or song not streamable.');
        }
    };

    player.stop = function () {
        if (player.speaker) {
            player.speaker.readableStream.unpipe();
            player.speaker.Speaker.end();
            songEndTime = Date.now();
        }
    };

    player.add = function (song) {
        var songFromNotYetPlayedSongs = enhancedPlayerHelper.getSongFromNotYetPlayedSongs(song.id);
        if (!songFromNotYetPlayedSongs) {
            addSongToPlaylist(song);
            if (notPlaying()) {
                player.next();
            }
        } else {
            songFromNotYetPlayedSongs.votes++;
        }
        //TODO maybe move this to another layer
        enhancedPlayerHelper.sortNotPlayedSongsDescendingByVotes();
        enhancedPlayerHelper.printStatus();
    };

    function addSongToPlaylist(song) {
        var playlist = player._list;
        song.votes = song.votes || 1;
        song._id = playlist.length;
        playlist.push(song);
    }

    function notPlaying() {
        return songEndTime < Date.now();
    }

    return {
        next: player.next,
        stop: player.stop,
        add: player.add,
        getNotYetPlayedSongsStream: enhancedPlayerHelper.getNotYetPlayedSongsStream
    }
})();