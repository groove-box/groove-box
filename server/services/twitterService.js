var Twitter = require('twitter');
var path = require('path');
var twitterCredentials = require(path.join(__dirname, '..', '..', 'config', 'twitterCredentials'));
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

    function addTimestamp(text) {
        return text + ' #' + new Date().getTime();
    }

    function tweet(text, callback) {
        text = addTimestamp(text);
        client.post('statuses/update', {status: text}, function (err) {
            if (err) {
                console.log('Twitter error: ', err);
            } else {
                console.log('Tweeted: ' + text);
            }
            if (callback) {
                callback();
            }
        });
    }

    function getLastUrlFromTweetText(text) {
        var lastUrl = '';
        URI.withinString(text, function (url) {
            lastUrl = url;
            return url;
        });
        return lastUrl;
    }

    function listenForUrlsInTweets(hashtag, callback) {
        client.stream('statuses/filter', {track: hashtag}, function (stream) {
            stream.on('data', function (tweet) {
                request.head({url: getLastUrlFromTweetText(tweet.text), followAllRedirects: true}, function (err, res) {
                    if (err) {
                        console.log('Twitter error: ' + err);
                    } else {
                        callback(res.request.href);
                    }
                });
            });
            stream.on('error', function (err) {
                console.log('Twitter error: ' + err);
            });
        });
    }

    return {
        tweet: tweet,
        listenForUrlsInTweets: listenForUrlsInTweets
    };
})();