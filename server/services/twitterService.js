var Twitter = require('twitter');
var twitterCredentials = require(require('path').join(__dirname, '..', '..', 'config', 'twitterCredentials'));

module.exports = (function () {
    'use strict';

    var client = new Twitter({
        consumer_key: twitterCredentials.consumerKey,
        consumer_secret: twitterCredentials.consumerSecret,
        access_token_key: twitterCredentials.accessTokenKey,
        access_token_secret: twitterCredentials.accessTokenSecret
    });

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

    function addTimestamp(tweet) {
        return tweet + ' #' + new Date().getTime();
    }

    return {
        tweet: tweet
    };
})();