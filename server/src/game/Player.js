import uuidv4  from 'uuid/v4';

export default class Player {
  constructor(socket) {
    this.socket = socket;
    this.id = uuidv4();

    socket.on('disconnect', this.onDisconnect, this);
  }

  getId() {
    return this.id;
  }

  onFire() {
    this.socket.broadcast.emit('');
  }

  onDisconnect() {
    console.log(`player ${this.id} disconnected`);
    playerManager.playerDisconnected(socket);
  }
}