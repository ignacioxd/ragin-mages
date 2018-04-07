import Player  from './Player';
import Leaderboard  from './Leaderboard';

export default class PlayerManager {
  constructor(socketio) {
    this.io = socketio;
    
    this.players = new Map();
    this.leaderboard = new Leaderboard(this);

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

    console.log(this.players.size, 'players connected');

    socket.on('disconnect', () => {
      this.players.delete(socket);
      socket.broadcast.emit('playerDisconnected', player.id);
      console.log(this.players.size, 'players connected');
      if(this.leaderboard.remove(player)) {
        this.broadcastLeaderboard();
      }
    });
  }

  reportKill(deadPlayer, killedById) {
    let shouldBroadcastLeaderboard = this.leaderboard.remove(deadPlayer);
    for(let [socket, player] of this.players) {
      if(player.id == killedById) {
        player.kills++;
        if(this.leaderboard.update(player)) {
          shouldBroadcastLeaderboard = true;
        }
        break;
      }
    }
    if(shouldBroadcastLeaderboard) {
      this.broadcastLeaderboard();
    }
  }

  broadcastLeaderboard() {
    console.log('broadcasting leaderboard');
    this.io.to('game').emit('updateLeaderboard', this.leaderboard.getArray());
  }
}