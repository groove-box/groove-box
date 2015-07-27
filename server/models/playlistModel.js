var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = new Schema({
  permaLinkUrl: String,
  votes: Number
});

var playlistSchema = new Schema({
  hashtag: String,
  songs: [songSchema]
});

mongoose.model('Playlist', playlistSchema);