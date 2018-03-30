import uuidv4  from 'uuid/v4';

export default class PlayerManager {
  constructor(socketio) {
    this.io = socketio;
    this.lobbyPlayerMap = new Map();
    this.gamePlayerMap = new Map();

    this.io.on('connection', this.playerConnected.bind(this));
  }

  playerConnected(socket) {
    socket.id = uuidv4();
    this.lobbyPlayerMap.set(socket.id, socket);
    socket.emit('setId', socket.id);

    console.log('Player connected', socket.id);
    console.log(this.lobbyPlayerMap.size + this.gamePlayerMap.size, 'players connected,', this.gamePlayerMap.size, 'in game');

    socket.on('disconnect', () => {
      this.playerDisconnected(socket);
    });

    //Handle messages sent by players
    socket.on('joinGame', (character, handle) => {
      console.log('joinGame', socket.id);
      //Store attributes locally
      socket.character = character;
      socket.handle = handle;
      socket.x = Math.random() * 400 - 200;
      socket.y = Math.random() * 400 - 200;
      //Create a list of existing connected players
      let existingPlayers = [];
      for(let [key, value] of this.gamePlayerMap) {
        existingPlayers.push({
          id: value.id,
          handle: value.handle,
          character: value.character,
          x: value.x,
          y: value.y,
          orientation: value.orientation
        });
      } 
      
      //Move player from lobby to game list
      this.lobbyPlayerMap.delete(socket.id);
      this.gamePlayerMap.set(socket.id, socket);
      //Send player list to new player
      socket.emit('existingPlayers', existingPlayers);
      //Notify everyone of this new player
      socket.broadcast.emit('playerJoined', socket.id, character, handle, socket.x, socket.y);
      console.log(this.lobbyPlayerMap.size + this.gamePlayerMap.size, 'players connected,', this.gamePlayerMap.size, 'in game');
    });
    
    socket.on('setMotion', (posX, posY, vecX, vecY) => {
      socket.x = posX;
      socket.y = posY;
      socket.motionVector = {x: vecX, y: vecY};
      socket.broadcast.emit('setMotion', socket.id, posX, posY, vecX, vecY);
    });

    socket.on('setPosition', (x, y, orientation) => {
      socket.x = x;
      socket.y = y;
      socket.orientation = orientation;
      socket.broadcast.emit('setPosition', socket.id, x, y, orientation);
    });

    
    socket.on('fire', (posX, posY, toX, toY) => {
      socket.x = posX;
      socket.y = posY;
      socket.broadcast.emit('playerFired', socket.id, posX, posY, toX, toY);
    });

    socket.on('death', (posX, posY, killedById) => {
      socket.x = posX;
      socket.y = posY;
      socket.broadcast.emit('playerDied', socket.id, posX, posY, killedById);
    });

    socket.on('respawn', () => {
      socket.x = Math.random() * 400 - 200;
      socket.y = Math.random() * 400 - 200;
      //Notify everyone of this new player
      socket.broadcast.emit('playerJoined', socket.id, socket.character, socket.handle, socket.x, socket.y);
      console.log(this.lobbyPlayerMap.size + this.gamePlayerMap.size, 'players connected,', this.gamePlayerMap.size, 'in game');
    });

    socket.on('exitGame', () => {
      this.gamePlayerMap.delete(socket.id);
      this.lobbyPlayerMap.set(socket.id, socket);
      socket.broadcast.emit('playerExited', socket.id);
    });
    
  }

  playerDisconnected(socket) {
    this.gamePlayerMap.delete(socket.id);
    this.lobbyPlayerMap.delete(socket.id);
    socket.broadcast.emit('playerDisconnected', socket.id);
    console.log(this.lobbyPlayerMap.size + this.gamePlayerMap.size, 'players connected,', this.gamePlayerMap.size, 'in game');

  }
}