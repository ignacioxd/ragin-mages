
import express from 'express';
import http from 'http';
import io from 'socket.io';
import config from './config.json';

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

const port = process.env.PORT || config.port;
server.listen(port, function() {
  console.log(`Server listening on *:${port} (e.g., http://localhost:${port})`);
});

socketio.listen(server);

new PlayerManager(socketio);
