var soundCloudApiWrapper = require('soundcloud-nodejs-api-wrapper');
var credentials = require(require('path').join(__dirname, '..', '..', 'config', 'credentials.json'));
var request = require('request');

module.exports = (function () {
    'use strict';

    var soundCloudClientFactory = new soundCloudApiWrapper({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        username: credentials.username,
        password: credentials.password
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
        request.get(unresolvedStreamUrl + '?client_id=' + credentials.clientId, function (err, res) {
            callback(res.request.uri.href);
        });
    }

    return {
        getSong: getSong,
        getStreamUrl: getStreamUrl
    }
})();