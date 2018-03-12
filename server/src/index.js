
import express from 'express';
import http from 'http';
import io from 'socket.io';

let app = express();
let server = http.Server(app);
let socketio = io(http);

socketio.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

server.listen(3030, function() {
  console.log('Server listening on *:3030 (e.g., http://localhost:3030)');
});