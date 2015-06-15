var path = require('path');
var servicesPath = path.join(__dirname, '..', 'services');
var soundCloudService = require(path.join(servicesPath, 'soundCloudService'));
var PlayerService = require(path.join(servicesPath, 'playerService'));
var playerService = new PlayerService();

module.exports = (function () {
    'use strict';

    function play(req, res) {
        console.log(req.body);
        console.log('-------');
        console.log('Received URL:', req.body.url);
        soundCloudService.getSong(req.body.url, function (song) {
            console.log('Added SoundCloud Track: ', song.id);
            playerService.addToPlaylist(song);
        }, function () {
            console.log("Invalid URL");
        });
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