var path = require('path');
var Player = require('player');
var soundCloudService = require(path.join(__dirname, 'soundCloudService'));
var twitterService = require(path.join(__dirname, 'twitterService'));
var lazy = require('lazy.js');

module.exports = (function () {
    'use strict';

    var player = new Player([]).enable('stream')
            .on('error', function (err) {
                player.stop();
                console.log(err);
            })
            .on('playing', function (song) {
                twitterService.tweet('Currently playing: ' + song.title + '. Check it out: ' + song.permalink_url);
            });
    player.next = function () {
        playNextSong()
    };

    function getSongFromPlaylist(songId) {
        return player._list[lazy(player._list).map(function (currentSong) {
            return currentSong.id
        }).indexOf(songId)];
    }

    function getIndexOfNextPlayingSong() {
        return player.history.length;
    }

    function playNextSong() {
        var indexOfNextPlayingSong = getIndexOfNextPlayingSong();
        var song = player._list[indexOfNextPlayingSong];
        if (song && song.streamable) {
            soundCloudService.getStreamUrl(song.stream_url, function (streamUrl) {
                song[player.options.src] = streamUrl;
                player.play(getIndexOfNextPlayingSong());
            });
        }
    }

    function sortNotPlayingSongsDescendingByVotes() {
        var indexOfNextPlayingSong = getIndexOfNextPlayingSong();
        player._list = lazy(player._list).initial(player._list.length - indexOfNextPlayingSong)
                .concat(lazy(player._list).slice(indexOfNextPlayingSong).sortBy(function (song) {
                    return song.votes;
                }, true).toArray()).toArray();
    }

    function logPlaylist() {
        player._list.forEach(function (currentSong, index) {
            console.log(index + 1 + '. votes: ' + currentSong.votes + ' title: ' + currentSong.title);
        });
    }

    function addFromSoundCloudUrl(url) {
        console.log('-------');
        console.log('Received URL:', url);
        soundCloudService.getSong(url, function (song) {
            console.log('Added SoundCloud Song: ', song.id);
            var songFromPlaylist = getSongFromPlaylist(song.id);
            if (!songFromPlaylist) {
                song.votes = 1;
                player.add(song);
                if (!player.playing) {
                    playNextSong()
                }
            } else {
                songFromPlaylist.votes++;
                sortNotPlayingSongsDescendingByVotes();
            }
            logPlaylist();
        }, function () {
            console.log('Invalid URL');
        });
    }

    return {
        addFromSoundCloudUrl: addFromSoundCloudUrl
    }
})();