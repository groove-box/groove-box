var https = require('https');
var path = require('path');
var SoundCloud = require('soundcloud-nodejs-api-wrapper');
var request = require('request');
var config = require(path.join(__dirname, '..', 'config', 'config.js'));

function SoundcloudWrapper() {
    this.access_token = null;
    this.client = null;
    this.initialized = false;
}

SoundcloudWrapper.prototype.init = function () {
    if (this.isInitialized()) {
        return;
    }
    this.initialized = true;

    var sc = new SoundCloud({
        client_id: config.credentials.client_id,
        client_secret: config.credentials.client_secret,
        username: config.credentials.username,
        password: config.credentials.password
    });

    var client = sc.client();

    client.exchange_token(function (err, result) {
        this.access_token = arguments[3].access_token;
    });

    this.client = sc.client({access_token: this.access_token});
};

SoundcloudWrapper.prototype.isInitialized = function () {
    return this.initialized;
};

SoundcloudWrapper.prototype.resolvePermaLinkUrl = function (resolveUrl, callback, error) {
    if (!this.isInitialized) {
        this.init();
    }

    this.client.get('/resolve', {url: resolveUrl}, function (err, result) {
        if (typeof result == "undefined") {
            error();
        } else {
            https.get(result.location, function (res) {
                res.setEncoding('utf8');
                var body = '';
                res.on('data', function (chunk) {
                    body += chunk;
                });
                res.on('end', function () {
                    var song = JSON.parse(body);
                    if (callback) {
                        callback({
                            track_data: song
                        });
                    }
                });
            });
        }
    });
};

SoundcloudWrapper.prototype.resolveStreamUrl = function (stream_url, callback) {
    if (!this.isInitialized) {
        this.init();
    }

    if (stream_url) {
        var stream_url_to_query = stream_url + '?client_id=' + config.credentials.client_id;
        request(stream_url_to_query, function (error, response, body) {
            if (callback) {
                callback(response['request'].uri.href);
            }
        });
    }
};

module.exports = SoundcloudWrapper;
