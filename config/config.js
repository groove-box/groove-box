var path = require('path');

var config = {
    playerService: {
        playlistLocation: path.join(__dirname, 'playlist.dump.json')
    },
    credentials: require(path.join(__dirname, 'credentials.json'))
};

module.exports = config;