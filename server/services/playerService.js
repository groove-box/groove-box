var path = require('path');
var Player = require('player');
var soundCloudService = require(path.join(__dirname, 'soundCloudService'));
var twitterService = require(path.join(__dirname, 'twitterService'));

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

    function getNextTrackIndex() {
        return player.history.length;
    }

    function playNextTrack() {
        var song = player._list[getNextTrackIndex()];
        if (song && song.streamable) {
            soundCloudService.getStreamUrl(song.stream_url, function (streamUrl) {
                song[player.options.src] = streamUrl;
                player.play(function (song) {
                    song.finished = true;
                    playNextTrack();
                });
            });
        }
    }

    function sortPlaylistByVotes() {
        if (player._list.length > 1) {
            var nextTrackIndex = getNextTrackIndex();
            var sortablePlaylistPart = player._list.slice(nextTrackIndex);

            if (sortablePlaylistPart.length > 0) {
                sortablePlaylistPart.sort(function (a, b) {
                    var result = 0;
                    // We are sorting descending here, so the numbers are reversed.
                    if (a.votes > b.votes) {
                        result = -1;
                    }
                    else if (a.votes < b.votes) {
                        result = 1;
                    }

                    return result;
                });

                var parametersForSplice = sortablePlaylistPart;
                parametersForSplice.unshift(nextTrackIndex, player._list.length);

                Array.prototype.splice.apply(
                        player._list,
                        parametersForSplice
                );
            }
        }
    }

    function addFromSoundCloudUrl(url) {
        console.log('-------');
        console.log('Received URL:', url);
        soundCloudService.getSong(url, function (song) {
            console.log('Added SoundCloud Track: ', song.id);

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

                var currentTrack = player.playing;
                if (!(!!currentTrack && currentTrack.finished === false)) {
                    playNextTrack()
                }

            } else {
                songFromPlaylist.votes++;
                songFromPlaylist.finished = false;
                sortPlaylistByVotes();
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