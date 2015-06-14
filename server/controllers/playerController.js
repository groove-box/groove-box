var path = require('path');
var servicesPath = path.join(__dirname, '..', 'services');
var SoundcloudService = require(path.join(servicesPath, 'soundcloudService'));
var PlayerService = require(path.join(servicesPath, 'playerService'));
var soundcloudService = new SoundcloudService();
soundcloudService.init();
var playerService = new PlayerService();

module.exports = (function () {
    'use strict';

    function play(req, res, next) {
        console.log(req.body);
        console.log('-------');
        console.log('Received URL:', req.body.url);
        soundcloudService.resolvePermaLinkUrl(req.body.url, function (track_hash) {
            console.log('Added SoundCloud Track: ', track_hash.track_data.id);
            playerService.addToPlaylist(track_hash);
        }, function () {
            console.log("Invalid URL");
        });
        res.json(req.body);
    }

    function stop(req, res, next) {
        playerService.stop();
        res.end();
    }

    function next(req, res, next) {
        playerService.next();
        res.end();
    }

    function dump(req, res, next) {
        res.json(playerService.dump());
    }

    return {
        play: play,
        stop: stop,
        next: next,
        dump: dump
    };
})();