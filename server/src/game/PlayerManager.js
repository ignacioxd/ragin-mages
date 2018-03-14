import Player from './game/Player';

export default class PlayerManager {
  constructor() {
    this.lobbyPlayerMap = new Map();
    this.gamePlayerMap = new Map();
  }

  playerConnected(socket) {
    let player = new Player(socket, this);
    this.playerMap.set(socket, player);
  }

  playerDisconnected(socket) {
    let player = this.playerMap.get(socket);
    this.playerMap.delete(socket);

    player = null;
  }
}