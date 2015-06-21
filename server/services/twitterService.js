var request = require('request');

module.exports = (function () {
    'use strict';

    function tweet(tweetText, callback) {
        tweetText = addTimestamp(tweetText);
        request.post({url: 'http://localhost:3000/tweet', json: true, body: {status: tweetText}}, function (err) {
            if (err) {
                console.log('Tweeter error: ', err);
                console.log('Initial tweet: ', tweetText);
            } else {
                console.log('Tweeted: ' + tweetText);
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