var path = require('path');
var libPath = path.join(__dirname, '..', '..', 'lib');
var SoundcloudWrapper = require(path.join(libPath, 'soundcloud_wrapper'));
var PlayerWrapper = require(path.join(libPath, 'player_wrapper'));
var soundcloudWrapper = new SoundcloudWrapper();
soundcloudWrapper.init();
var playerWrapper = new PlayerWrapper();

module.exports = (function () {
    'use strict';

    function play(req, res, next) {
        console.log(req.body);
        console.log('-------');
        console.log('Received URL:', req.body.url);
        soundcloudWrapper.resolvePermaLinkUrl(req.body.url, function (track_hash) {
            console.log('Added SoundCloud Track: ', track_hash.track_data.id);
            playerWrapper.addToPlaylist(track_hash);
        }, function () {
            console.log("Invalid URL");
        });
        res.json(req.body);
    }

    function stop(req, res, next) {
        playerWrapper.stop();
        res.end();
    }

    function next(req, res, next) {
        playerWrapper.next();
        res.end();
    }

    function dump(req, res, next) {
        res.json(playerWrapper.dump());
    }

    return {
        play: play,
        stop: stop,
        next: next,
        dump: dump
    };
})();