var playerService = require(require('path').join(__dirname, '..', 'services', 'playerService'));

module.exports = (function () {
    'use strict';

    function next(req, res) {
        playerService.next();
        res.end();
    }

    function stop(req, res) {
        playerService.stop();
        res.end();
    }

    function play(req, res) {
        playerService.add(req.body.url);
        res.end();
    }

    function dumpNotYetPlayedSongs(req, res) {
        playerService.dumpNotYetPlayedSongs(function () {
            res.end();
        });
    }

    return {
        next: next,
        stop: stop,
        play: play,
        dumpNotYetPlayedSongs: dumpNotYetPlayedSongs
    };
}());