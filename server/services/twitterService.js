var request = require('request');

module.exports = (function () {
    'use strict';

    function tweet(tweet, callback) {
        tweet = addTimestamp(tweet);
        request.post({url: 'http://localhost:3000/tweet', json: true, body: {status: tweet}},
                function (err) {
                    if (err) {
                        console.log('Tweeter error: ', err);
                        console.log('Initial tweet: ', tweet);
                    } else {
                        console.log('Tweeted: ' + tweet);
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