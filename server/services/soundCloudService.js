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

    function getSongFromResolvedPermaLinkUrl(resolvedPermaLinkUrl, successCallback, errorCallback) {
        request.get(resolvedPermaLinkUrl, function (err, response, song) {
            if (err) {
                errorCallback();
            } else {
                successCallback(JSON.parse(song));
            }
        });
    }

    function getSong(permaLinkUrl, successCallback, errorCallback) {
        soundCloudClientFactory.client().get('/resolve', {url: permaLinkUrl}, function (err, resolvedPermaLink) {
            if (err) {
                errorCallback();
            } else {
                getSongFromResolvedPermaLinkUrl(resolvedPermaLink.location, successCallback, errorCallback)
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