
import express from 'express';
import http from 'http';
import io from 'socket.io';

import PlayerManager from './game/PlayerManager';

let app = express();
let server = http.Server(app);
let socketio = io(http);

new PlayerManager(socketio);


server.listen(3030, function() {
  console.log('Server listening on *:3030 (e.g., http://localhost:3030)');
});