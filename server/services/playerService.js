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

    function playNextSong() {
        var song = player._list[0];
        if (song && song.streamable) {
            soundCloudService.getStreamUrl(song.stream_url, function (streamUrl) {
                song[player.options.src] = streamUrl;
                player.play(function (song) {
                    song.finished = true;
                    playNextSong();
                });
            });
        }
    }

    function addFromSoundCloudUrl(url) {
        console.log('-------');
        console.log('Received URL:', url);
        soundCloudService.getSong(url, function (song) {
            console.log('Added SoundCloud Song: ', song.id);

            var songFromPlaylist;
            player._list.forEach(function (currentSong) {
                if (currentSong.id === song.id) {
                    songFromPlaylist = currentSong;
                }
            });

            if (!songFromPlaylist) {
                song.finished = false;
                song.votes = 1;
                player.add(song);

                var currentSong = player.playing;
                if (!(!!currentSong && currentSong.finished === false)) {
                    playNextSong()
                }

            } else {
                songFromPlaylist.votes++;
                songFromPlaylist.finished = false;

                player._list = lazy([player._list[0]]).concat(lazy(player._list).slice(1).sortBy(function (song) {
                    return song.votes;
                }, true).toArray()).toArray();
            }

            player._list.forEach(function (currentSong, index) {
                console.log(index + 1 + '. votes: ' + currentSong.votes + ' title: ' + currentSong.title);
            });

        }, function () {
            console.log('Invalid URL');
        });
    }

    return {
        addFromSoundCloudUrl: addFromSoundCloudUrl
    }
})();