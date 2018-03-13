
import express from 'express';
import http from 'http';
import io from 'socket.io';

import PlayerManager from './game/PlayerManager';

let app = express();
let server = http.Server(app);
let socketio = io(http);

let playerManager = new PlayerManager();

socketio.on('connection', function(socket) {
  playerManager.playerConnected(socket);
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
    playerManager.playerDisconnected(socket);
  });
});

server.listen(3030, function() {
  console.log('Server listening on *:3030 (e.g., http://localhost:3030)');
});