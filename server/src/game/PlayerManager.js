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

  AddToKillCount(id){
    let index=this.leaderBoard.findIndex((value) =>  value.id==id);
    if (index>-1) {
      console.log('add kill found',id)
      this.leaderBoard[index].kills ++;
    }
    this.UpdateRankings();
    // console.log('after killcount',this.leaderBoard);
  }

  UpdateRankings(){
    console.log('updating rankings');
    this.leaderBoard.sort(function(char1,char2)  {
      if (char1.kills < char2.kills)
        return 1;
      if (char1.kills > char2.kills)
        return -1;
      return 0;
    });

    this.leaderBoard.forEach( function (character,index) {
      if (character.kills>0) {
        character.currentRank=index+1;
        if (character.currentRank<character.highestRank || character.highestRank==null) {
          character.UpdateHighestRank(character.currentRank);
          // character.highestRank=character.currentRank;
          // //currently send message just to player that they have a new highest ranking
          // character.socket.to('game').emit('highestRanking', character.highestRank);
          // character.socket.emit('highestRanking', character.highestRank);
          // console.log('sent',character.character,'rank',character.highestRank);
        }
      }
    })
  }

  RemovePlayerFromLeaderBoard(id) {
    const delIndex=this.leaderBoard.findIndex((value) =>  value.id==id);
    // console.log('delete item',delIndex,this.leaderBoard[delIndex]);
    if (delIndex>-1) {
      console.log('removed', delIndex);
      this.leaderBoard.splice(delIndex,1);
    }
    // console.log('after removal',this.leaderBoard);
  }
}