import EventEmitter  from 'eventemitter3';

export default class Server extends EventEmitter {
  constructor() {
    super();
    if(Server.socket) {
      this.requestEvents();
    }
  }

  isConnected() {
    return Server.socket ? Server.socket.connected : false;
  }

  getClientId() {
    return Server.clientId;
  }

  requestEvents() {
    if(!Server.socket) {
      throw new Error('Socket connection not attempted. Try opening a connection first.');
    }
    Server.socket.removeAllListeners();
    Server.socket.on('connect', this.serverConnected.bind(this));
    Server.socket.on('disconnect', this.serverDisconnected.bind(this))
    Server.socket.on('setId', this.setId.bind(this));
    Server.socket.on('existingPlayers', this.existingPlayers.bind(this));
    Server.socket.on('spawn', this.spawn.bind(this));
    Server.socket.on('playerJoined', this.playerJoined.bind(this));
    Server.socket.on('playerLeft', this.playerLeft.bind(this));
    Server.socket.on('playerMoved', this.playerMoved.bind(this));
    Server.socket.on('playerFired', this.playerFired.bind(this));
    Server.socket.on('playerHit', this.playerHit.bind(this));
    Server.socket.on('playerDied', this.playerDied.bind(this));
    Server.socket.on('playerDisconnected', this.playerDisconnected.bind(this));
    Server.socket.on('updateLeaderboard', this.updateLeaderboard.bind(this));
  }

  connect(protocol, host, port) {
    if(this.isConnected()) return;
    if(Server.socket) Server.socket.removeAllListeners();
    Server.socket = io(`${protocol}://${host}:${port}`);
    this.requestEvents();
  }

  serverConnected() {
    console.log('serverConnected');
    this.emit('serverConnected');
  }

  serverDisconnected() {
    console.log('serverDisconnected');
    this.emit('serverDisconnected');
  }

  setId(id) {
    Server.clientId = id;
    this.emit('setId', id);
  }

  existingPlayers(existingPlayers) {
    this.emit('existingPlayers', existingPlayers);
  }

  spawn(x, y) {
    this.emit('spawn', x, y);
  }

  playerJoined(id, character, handle, x, y) {
    this.emit('playerJoined', id, character, handle, x, y);
  }

  playerLeft(id) {
    this.emit('playerLeft', id);
  }

  playerMoved(id, x, y, vecX, vecY) {
    this.emit('playerMoved', id, x, y, vecX, vecY);
  }

  playerFired(id, fromX, fromY, toX, toY) {
    this.emit('playerFired', id, fromX, fromY, toX, toY);
  }

  playerHit(id, x, y, damage, hitById) {
    this.emit('playerHit', id, x, y, damage, hitById);
  }

  playerDied(id, x, y, killedById) {
    this.emit('playerDied', id, x, y, killedById);
  }

  playerDisconnected(id) {
    this.emit('playerDisconnected', id);
  }

  updateLeaderboard(leaderboard) {
    this.emit('updateLeaderboard',leaderboard);
  }

  send(message, ...data) {
    if(!this.isConnected()) return;
    Server.socket.emit(message, ...data);
  }
  
}
