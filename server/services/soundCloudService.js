var soundCloudApiWrapper = require('soundcloud-nodejs-api-wrapper');
var config = require(require('path').join(__dirname, '..', '..', 'config', 'config.js'));
var soundCloudClientFactory = new soundCloudApiWrapper({
    client_id: config.credentials.clientId,
    client_secret: config.credentials.clientSecret,
    username: config.credentials.username,
    password: config.credentials.password
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