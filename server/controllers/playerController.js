var PlayerService = require(require('path').join(__dirname, '..', 'services', 'playerService'));
var playerService = new PlayerService();

module.exports = (function () {
    'use strict';

    function play(req, res) {
        playerService.addFromSoundCloudUrl(req.body.url);
        res.end();
    }

    function stop(req, res) {
        playerService.stop();
        res.end();
    }

    function next(req, res) {
        playerService.next();
        res.end();
    }

    return {
        play: play,
        stop: stop,
        next: next
    };
})();