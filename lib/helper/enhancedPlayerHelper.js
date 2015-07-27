var lazy = require('lazy.js');

module.exports = function (player) {
  'use strict';

  function getIndexOfNextPlayingSong() {
    return player.history.length;
  }

  function getSongFromNotYetPlayedSongs(songId) {
    return getNotYetPlayedSongsStream().find(function (song) {
      return songId === song.id;
    });
  }

  function sortNotPlayedSongsDescendingByVotes() {
    player._list = getAlreadyPlayedSongsStream().concat(getNotYetPlayedSongsStream().sortBy(function (song) {
      return song.votes;
    }, true)).toArray();
  }

  function printStatus() {
    console.log('-------');
    printCurrentlyPlayingSong();
    console.log('Next up:');
    printNotYetPlayedSongs();
  }

  function printCurrentlyPlayingSong() {
    var indexOfNextPlayingSong = getIndexOfNextPlayingSong();
    if (indexOfNextPlayingSong > 0) {
      var currentSong = lazy(player._list).get(indexOfNextPlayingSong - 1);
      console.log('Playing: ' + currentSong.title + ' with ' + currentSong.votes + ' votes');
    }
  }

  function printNotYetPlayedSongs() {
    getNotYetPlayedSongsStream().each(function (currentSong, index) {
      console.log('  ' + (index + 1) + '. votes: ' + currentSong.votes + ' title: ' + currentSong.title);
    });
  }

  function getNotYetPlayedSongsStream() {
    return lazy(player._list).slice(getIndexOfNextPlayingSong());
  }

  function getAlreadyPlayedSongsStream() {
    var playlist = player._list;
    return lazy(playlist).initial(playlist.length - getIndexOfNextPlayingSong());
  }

  return {
    getIndexOfNextPlayingSong: getIndexOfNextPlayingSong,
    getSongFromNotYetPlayedSongs: getSongFromNotYetPlayedSongs,
    sortNotPlayedSongsDescendingByVotes: sortNotPlayedSongsDescendingByVotes,
    printStatus: printStatus,
    getNotYetPlayedSongsStream: getNotYetPlayedSongsStream
  }
};