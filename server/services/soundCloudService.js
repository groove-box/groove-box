var soundCloudApiWrapper = require('soundcloud-nodejs-api-wrapper');
var soundCloudCredentials = require(require('path').join(__dirname, '..', '..', 'config', 'soundCloudCredentials.json'));
var request = require('request');

module.exports = (function () {
    'use strict';

    var soundCloudClientFactory = new soundCloudApiWrapper({
        client_id: soundCloudCredentials.clientId,
        client_secret: soundCloudCredentials.clientSecret,
        username: soundCloudCredentials.username,
        password: soundCloudCredentials.password
    });

    function getSongFromResolvedPermaLinkUrl(resolvedPermaLinkUrl, callback) {
        request.get(resolvedPermaLinkUrl, function (err, response, song) {
            if (err) {
                console.log('SoundCloud error: ' + err);
            } else {
                callback(JSON.parse(song));
            }
        });
    }

    function getSong(permaLinkUrl, callback) {
        soundCloudClientFactory.client().get('/resolve', {url: permaLinkUrl}, function (err, resolvedPermaLink) {
            if (err) {
                console.log('SoundCloud error: ' + err);
            } else {
                getSongFromResolvedPermaLinkUrl(resolvedPermaLink.location, callback)
            }
        });
    }

    function getStreamUrl(unresolvedStreamUrl, callback) {
        request.get(unresolvedStreamUrl + '?client_id=' + soundCloudCredentials.clientId, function (err, res) {
            callback(res.request.uri.href);
        });
    }

    return {
        getSong: getSong,
        getStreamUrl: getStreamUrl
    }
})();