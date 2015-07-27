var Twitter = require('twitter');
var path = require('path');
var configPath = path.join(__dirname, '..', '..', 'config');
var twitterCredentials = require(path.join(configPath, 'twitterCredentials'));
var twitterConfig = require(path.join(configPath, 'twitterConfig'));
var request = require('request');
var URI = require('URIjs');
var Q = require('q');

module.exports = (function () {
  'use strict';

  var client = new Twitter({
    consumer_key: twitterCredentials.consumerKey,
    consumer_secret: twitterCredentials.consumerSecret,
    access_token_key: twitterCredentials.accessTokenKey,
    access_token_secret: twitterCredentials.accessTokenSecret
  });

  function tweet(text) {
    var deferred = Q.defer();
    text = addTimestamp(text);
    client.post('statuses/update', {status: text}, function (err) {
      if (err) {
        console.log('Twitter error: ', err);
      } else {
        console.log('Tweeted: ' + text);
      }
      deferred.resolve();
    });
    return deferred.promise;
  }

  function listenForUrlsInTweets(callback) {
    client.stream('statuses/filter', {track: twitterConfig.hashtag}, function (stream) {
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

  function addTimestamp(text) {
    return text + ' #' + new Date().getTime();
  }

  function getLastUrlFromTweetText(text) {
    var lastUrl = '';
    URI.withinString(text, function (url) {
      lastUrl = url;
      return url;
    });
    return lastUrl;
  }

  return {
    tweet: tweet,
    listenForUrlsInTweets: listenForUrlsInTweets
  };
}());