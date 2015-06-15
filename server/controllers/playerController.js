var path = require('path');
var servicesPath = path.join(__dirname, '..', 'services');
var soundCloudService = require(path.join(servicesPath, 'soundCloudService'));
var PlayerService = require(path.join(servicesPath, 'playerService'));
var playerService = new PlayerService();

module.exports = (function () {
    'use strict';

    function play(req, res, next) {
        console.log(req.body);
        console.log('-------');
        console.log('Received URL:', req.body.url);
        soundCloudService.resolvePermaLinkUrl(req.body.url, function (trackHash) {
            console.log('Added SoundCloud Track: ', trackHash.trackData.id);
            playerService.addToPlaylist(trackHash);
        }, function () {
            console.log("Invalid URL");
        });
        res.json(req.body);
    }

    function stop(req, res) {
        playerService.stop();
        res.end();
    }

    function next(req, res) {
        playerService.next();
        res.end();
    }

    function dump(req, res) {
        res.json(playerService.dump());
    }

    return {
        play: play,
        stop: stop,
        next: next,
        dump: dump
    };
})();