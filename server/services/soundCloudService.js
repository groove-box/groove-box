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

    function resolvePermaLinkUrl(permaLinkUrl, successCallback, errorCallback) {
        soundCloudClientFactory.client().get('/resolve', {url: permaLinkUrl}, function (err, tempLink) {
            if (err) {
                errorCallback();
            } else {
                request.get(tempLink.location, function (error, response, body) {
                    if (error) {
                        errorCallback();
                    } else {
                        successCallback({
                            trackData: JSON.parse(body)
                        });
                    }
                });
            }
        });
    }

    function resolveStreamUrl(streamUrl, callback) {
        request.get(streamUrl + '?client_id=' + config.credentials.clientId, function (error, response) {
            callback(response.request.uri.href);
        });
    }

    return {
        resolvePermaLinkUrl: resolvePermaLinkUrl,
        resolveStreamUrl: resolveStreamUrl
    }
})();