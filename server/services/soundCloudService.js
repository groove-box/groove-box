var soundCloudApiWrapper = require('soundcloud-nodejs-api-wrapper');
var soundCloudCredentials = require(require('path').join(__dirname, '..', '..', 'config', 'soundCloudCredentials'));
var request = require('request');
var Q = require('q');

module.exports = (function () {
    'use strict';

    var soundCloudClientFactory = new soundCloudApiWrapper({
        client_id: soundCloudCredentials.clientId,
        client_secret: soundCloudCredentials.clientSecret,
        username: soundCloudCredentials.username,
        password: soundCloudCredentials.password
    });

    function getSong(permaLinkUrl) {
        var deferred = Q.defer();
        soundCloudClientFactory.client().get('/resolve', {url: permaLinkUrl}, function (err, resolvedPermaLink) {
            if (err) {
                console.log('SoundCloud error: ' + err);
            } else {
                getSongFromResolvedPermaLinkUrl(resolvedPermaLink.location).then(function (song) {
                    deferred.resolve(song);
                }).done();
            }
        });
        return deferred.promise;
    }

    function resolveStreamUrl(unresolvedStreamUrl) {
        var deferred = Q.defer();
        request.get(unresolvedStreamUrl + '?client_id=' + soundCloudCredentials.clientId, function (err, res) {
            if (err) {
                console.log('SoundCloud error: ' + err);
            } else {
                deferred.resolve(res.request.uri.href);
            }
        });
        return deferred.promise;
    }

    function getSongFromResolvedPermaLinkUrl(resolvedPermaLinkUrl) {
        var deferred = Q.defer();
        request.get(resolvedPermaLinkUrl, function (err, res, song) {
            if (err) {
                console.log('SoundCloud error: ' + err);
            } else {
                deferred.resolve(JSON.parse(song));
            }
        });
        return deferred.promise;
    }

    return {
        getSong: getSong,
        resolveStreamUrl: resolveStreamUrl
    }
}());