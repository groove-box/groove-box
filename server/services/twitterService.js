module.exports = (function () {
    'use strict';

    function tweet(tweet, callback) {
        tweet = addTimestamp(tweet);
        require('request').post({url: 'http://localhost:3000/tweet', json: true, body: {status: tweet}},
                function (err, httpResponse, body) {
                    if (err) {
                        console.log('Tweeter error: ', err);
                        console.log('Initial tweet: ', tweet);
                    } else {
                        console.log('Tweeted: ' + tweet);
                        if (callback) {
                            callback();
                        }
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