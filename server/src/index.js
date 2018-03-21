
import express from 'express';
import http from 'http';
import io from 'socket.io';

import PlayerManager from './game/PlayerManager';

let app = express();
let server = http.Server(app);
let socketio = io(http);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

new PlayerManager(socketio);


server.listen(3030, function() {
  console.log('Server listening on *:3030 (e.g., http://localhost:3030)');
});

socketio.listen(server);