import uuidv4  from 'uuid/v4';

export default class PlayerManager {
  constructor(socketio) {
    this.io = socketio;
    this.lobbyPlayerMap = new Map();
    this.gamePlayerMap = new Map();

    this.io.on('connection', this.playerConnected, this);
  }

  playerConnected(socket) {
    socket.id = uuidv4();
    this.lobbyPlayerMap.set(socket.id, socket);

    socket.on('disconnect', () => {
      this.playerDisconnected(socket);
    });

    //Handle messages sent by players
    socket.on('joinGame', (character, handle) => {
      //Store attributes locally
      socket.character = character;
      socket.handle = handle;
      socket.x = 0;
      socket.y = 0;
      //Create a list of existing connected players
      let existingPlayers = [];
      this.gamePlayerMap.forEach((value) => {
        existingPlayers.push({
          id: value.id,
          handle: value.handle,
          character: value.character,
          x: value.x,
          y: value.y,
          orientation: value.orientation
        })
      });
      //Move player from lobby to game list
      this.lobbyPlayerMap.delete(socket.id);
      this.gamePlayerMap.set(socket.id, socket);
      //Send player list to new player and tell them where to spawn
      socket.emit('joinGame', socket.x, socket.y, existingPlayers);
      //Notify everyone else of this new player
      socket.broadcast.emit('playerJoined', socket.id, character, handle, socket.x, socket.y);
    });
    
    socket.on('setPosition', (x, y, orientation) => {
      socket.x = x;
      socket.y = y;
      socket.orientation = orientation;
      socket.broadcast.emit('setPosition', socket.id, x, y, orientation);
    });

    socket.on('exitGame', () => {
      this.gamePlayerMap.delete(socket.id);
      this.lobbyPlayerMap.set(socket.id, socket);
      socket.broadcast.emit('playerExited', socket.id);
    });
    
  }

  playerDisconnected(socket) {
    console.log('user disconnected');
    socket.broadcast('playerDisconnected', socket.id);
    this.gamePlayerMap.delete(socket.id);
    this.lobbyPlayerMap.delete(socket.id);
  }
}