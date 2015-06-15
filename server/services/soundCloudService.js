var soundCloudApiWrapper = require('soundcloud-nodejs-api-wrapper');
var credentials = require(require('path').join(__dirname, '..', '..', 'config', 'credentials.json'));
var soundCloudClientFactory = new soundCloudApiWrapper({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    username: credentials.username,
    password: credentials.password
});
var request = require('request');

module.exports = (function () {
    'use strict';

    function getSongFromResolvedPermaLinkUrl(tempLink, successCallback, errorCallback) {
        request.get(tempLink.location, function (err, response, body) {
            if (err) {
                errorCallback();
            } else {
                successCallback(JSON.parse(body));
            }
        });
    }

    function getSong(permaLinkUrl, successCallback, errorCallback) {
        soundCloudClientFactory.client().get('/resolve', {url: permaLinkUrl}, function (err, resolvedPermaLinkUrl) {
            if (err) {
                errorCallback();
            } else {
                getSongFromResolvedPermaLinkUrl(resolvedPermaLinkUrl, successCallback, errorCallback)
            }
        });
    }

    function resolveStreamUrl(streamUrl, callback) {
        request.get(streamUrl + '?client_id=' + credentials.clientId, function (err, response) {
            callback(response.request.uri.href);
        });
    }

    return {
        getSong: getSong,
        resolveStreamUrl: resolveStreamUrl
    }
})();