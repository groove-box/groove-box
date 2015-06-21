var enhancedPlayer = require(require('path').join(__dirname, '..', '..', 'lib', 'enhancedPlayer'));
var soundCloudService = require(require('path').join(__dirname, 'soundCloudService'));

module.exports = (function () {
    'use strict';

    function next() {
        enhancedPlayer.next();
    }

    function stop() {
        enhancedPlayer.stop();
    }

    function addFromSoundCloudUrl(url) {
        console.log('-------');
        soundCloudService.getSong(url, function (song) {
            var songFromPlaylist = enhancedPlayer.getSong(song.id);
            if (!songFromPlaylist) {
                song.votes = 1;
                enhancedPlayer.addToPlaylist(song);
                if (!enhancedPlayer.isPlaying()) {
                    enhancedPlayer.playNextSong()
                }
            } else {
                songFromPlaylist.votes++;
                enhancedPlayer.sortNotPlayedSongsDescendingByVotes();
            }
            enhancedPlayer.logPlaylist();
        });
    }

    return {
        next: next,
        stop: stop,
        addFromSoundCloudUrl: addFromSoundCloudUrl
    }
})();