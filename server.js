#!/usr/bin/env node

var path = require('path');

var app = require(path.join(__dirname, 'config', 'express'));
var twitterService = require(path.join(__dirname, 'server', 'services', 'twitterService'));

function normalizePort(val) {
    'use strict';

    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

var port = normalizePort(process.env.PORT || '1337');
app.set('port', port);
var server = require('http').createServer(app);

function onError(err) {
    'use strict';

    if (err.syscall !== 'listen') {
        throw err;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (err.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw err;
    }
}

function onListening() {
    'use strict';

    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    require('debug')('groove-box:server')('Listening on ' + bind);

    var hashtag = 'groov3box_bene';
    twitterService.tweet('Starting to party now! #' + hashtag);
    twitterService.addSongsFromTweets(hashtag);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

process.on('SIGINT', function () {
    'use strict';

    twitterService.tweet('Party is over!', function () {
        process.exit();
    });
});