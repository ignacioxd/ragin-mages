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
    console.log('setId');
    Server.clientId = id;
    this.emit('setId', id);
  }

  existingPlayers(existingPlayers) {
    console.log('existingPlayers');
    this.emit('existingPlayers', existingPlayers);
  }

  spawn(x, y) {
    console.log('spawn');
    this.emit('spawn', x, y);
  }

  playerJoined(id, character, handle, x, y) {
    console.log('playerJoined');
    this.emit('playerJoined', id, character, handle, x, y);
  }

  playerLeft(id) {
    console.log('playerLeft');
    this.emit('playerLeft', id);
  }

  playerMoved(id, x, y, vecX, vecY) {
    console.log('playerMoved');
    this.emit('playerMoved', id, x, y, vecX, vecY);
  }

  playerFired(id, fromX, fromY, toX, toY) {
    console.log('playerFired');
    this.emit('playerFired', id, fromX, fromY, toX, toY);
  }

  playerHit(id, x, y, damage, hitById) {
    console.log('playerHit');
    this.emit('playerHit', id, x, y, damage, hitById);
  }

  playerDied(id, x, y, killedById) {
    console.log('playerDied');
    this.emit('playerDied', id, x, y, killedById);
  }

  playerDisconnected(id) {
    console.log('playerDisconnected');
    this.emit('playerDisconnected', id);
  }

  send(message, ...data) {
    if(!this.isConnected()) return;
    Server.socket.emit(message, ...data);
  }
  
}
