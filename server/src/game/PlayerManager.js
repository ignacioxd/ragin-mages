import Player  from './Player';

export default class PlayerManager {
  constructor(socketio) {
    this.io = socketio;
    
    this.players = new Map();
    this.leaderBoard = [];

    this.io.on('connection', this.playerConnected.bind(this));
  }

  getAllPlayersInGame() {
    if(!this.io.sockets.adapter.rooms['game']) {
      return [];
    }
    let players = [];
    Object.keys(this.io.sockets.adapter.rooms['game'].sockets).forEach(socketId => {
      players.push(this.players.get(this.io.sockets.connected[socketId]));
    });
    return players;
  }

  playerConnected(socket) {
    let player = new Player(this, socket);
    this.players.set(socket, player);

    this.leaderBoard.push(player);
    
    console.log('Player connected', player.id);
    console.log(this.players.size, 'players connected');

    socket.on('disconnect', () => {
      this.players.delete(socket);
      socket.broadcast.emit('playerDisconnected', player.id);
      console.log(this.players.size, 'players connected');
    });
  }
}