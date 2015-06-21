var Twitter = require('twitter');
var twitterCredentials = require(require('path').join(__dirname, '..', '..', 'config', 'twitterCredentials'));
var URI = require('URIjs');
var request = require('request');

module.exports = (function () {
    'use strict';

    var client = new Twitter({
        consumer_key: twitterCredentials.consumerKey,
        consumer_secret: twitterCredentials.consumerSecret,
        access_token_key: twitterCredentials.accessTokenKey,
        access_token_secret: twitterCredentials.accessTokenSecret
    });

    function addTimestamp(tweet) {
        return tweet + ' #' + new Date().getTime();
    }

    function tweet(message, callback) {
        message = addTimestamp(message);
        client.post('statuses/update', {status: message}, function (err, tweet) {
            if (err) {
                console.log('Tweeter error: ', err);
                console.log('Initial tweet: ', message);
            } else {
                console.log('Tweeted: ' + message);
            }
            if (callback) {
                callback();
            }
        });
    }

    function filterForHashtag(hashtag, callback) {
        client.stream('statuses/filter', {track: hashtag}, function (stream) {
            stream.on('data', function (tweet) {
                console.log(JSON.stringify(tweet.text));
                var urls = [];
                URI.withinString(tweet.text, function (url) {
                    urls.push(url);
                    return url;
                });
                request.head({url: urls[urls.length - 1], followAllRedirects: true}, function (err, res) {
                    if (err) {
                        console.log(err)
                    } else {
                        callback(res.request.href);
                    }
                });
            });
            stream.on('error', function (err) {
                console.log('twitter error: ' + err);
            });
        });
    }

    return {
        tweet: tweet,
        filterForHashtag: filterForHashtag
    };
})();