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
    console.log('Player connected', socket.id);
    console.log('Player count is', this.gamePlayerMap.size);
    this.lobbyPlayerMap.set(socket.id, socket);

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
      /*this.gamePlayerMap.forEach((value) => {
        existingPlayers.push({
          id: value.id,
          handle: value.handle,
          character: value.character,
          x: value.x,
          y: value.y,
          orientation: value.orientation
        })
      });*/
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
    console.log('Player disconnected', socket.id);
    console.log('Player count is', this.gamePlayerMap.size);
    socket.broadcast.emit('playerDisconnected', socket.id);
    this.gamePlayerMap.delete(socket.id);
    this.lobbyPlayerMap.delete(socket.id);
  }
}