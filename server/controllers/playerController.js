var playerService = require(require('path').join(__dirname, '..', 'services', 'playerService'));

module.exports = (function () {
    'use strict';

    function play(req, res) {
        playerService.addFromSoundCloudUrl(req.body.url);
        res.end();
    }

    return {
        play: play
    };
})();