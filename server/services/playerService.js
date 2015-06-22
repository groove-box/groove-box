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

    function add(url) {
        soundCloudService.getSong(url, function (song) {
            enhancedPlayer.add(song);
        });
    }

    return {
        next: next,
        stop: stop,
        add: add
    }
})();