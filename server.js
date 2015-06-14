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

function onError(error) {
    'use strict';

    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    'use strict';

    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    require('debug')('GrooveBox_Player:server')('Listening on ' + bind);

    twitterService.tweet('Starting to party now! Suggest songs now with our hashtags now!');
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

process.on('SIGINT', function () {
    twitterService.tweet('Party is over! Go home. Be safe! DDaD!', function () {
        process.exit();
    });
});