#!/usr/bin/env node

import * as process from 'process';
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

import * as _debug from 'debug';
import * as http from 'http';

import Server from '../server';

const debug = _debug('backend:server');

const port = normalizePort(process.env.PORT || '3000');
Server.set('port', port);
console.log(`Port: ${port}`)

const server = http.createServer(Server);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);

    return isNaN(port)
        ? val
        : port >= 0
            ? port
            : false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

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
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;

    debug('Listening on ' + bind);
}
