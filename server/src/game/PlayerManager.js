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
      this.removePlayerFromLeaderBoard(player.id);
    });
  }

  AddToKillCount(id){
    let index=this.leaderBoard.findIndex((value) =>  value.id==id);
    if (index>-1) {
      this.leaderBoard[index].kills ++;
    }
    this.updateLeaderBoard();
  }

  updateLeaderBoard(){
    console.log('updating leaderBoard');
    this.leaderBoard.sort(function(char1,char2)  {
      if (char1.kills < char2.kills)
        return 1;
      if (char1.kills > char2.kills)
        return -1;
      return 0;
    });

    if (this.setPlayerRankings()) {
      this.sendLeaderBoard();
    }
  }
  
  setPlayerRankings() {
    let bChanged=false;
    var curRank = 0;
    var curKills = 0;
    this.leaderBoard.forEach(function (character) {
      if (character.kills > 0) {
        if (character.kills != curKills) {
          curRank++;
          curKills = character.kills;
        }
        bChanged = bChanged || character.currentRank != curRank;
        character.currentRank = curRank;
        if (character.currentRank < character.highestRank || character.highestRank == null) {
          bChanged = true;
          character.highestRank = character.currentRank;
        }
      }
    });
    return bChanged;
  }

  sendLeaderBoard() {
    let leaders = [];
    this.leaderBoard.filter(character => character.kills > 0)
      .forEach(value => {
        console.log(value.handle);
        leaders.push({
          id: value.id,
          handle: value.handle,
          character: value.character,
          kills: value.kills,
          currentRank: value.currentRank,
          highestRank: value.highestRank
        });
      });
    console.log('leaderboard', this.leaderBoard.length, 'leaders', leaders.length);
    this.io.to('game').emit('leaderBoard', leaders);
  }

  removePlayerFromLeaderBoard(id) {
    const delIndex=this.leaderBoard.findIndex((value) =>  value.id==id);
    if (delIndex>-1) {
      console.log('removed', delIndex);
      this.leaderBoard.splice(delIndex,1);
    }
  }
}