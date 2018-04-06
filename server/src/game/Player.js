import uuidv4  from 'uuid/v4';

export default class Player {
  constructor(playerManager, socket) {
    this.playerManager = playerManager;
    this.socket = socket;
    this.id = uuidv4();
    
    this.reset();

    socket.emit('setId', this.id);

    socket.on('joinGame', this.joinGame.bind(this));
    socket.on('leaveGame', this.leaveGame.bind(this));
    socket.on('respawn', this.respawn.bind(this));
    socket.on('move', this.move.bind(this));
    socket.on('fire', this.fire.bind(this));
    socket.on('hit', this.hit.bind(this));
    socket.on('die', this.die.bind(this));
  }

  reset() {
    this.character = null;
    this.handle = null;
    this.position = {
      x: 0,
      y: 0,
      motionVector: {x: 0, y: 0},
      lastUpdate: 0
    };
  }

  joinGame(character, handle) {
    //Store attributes locally
    this.character = character;
    this.handle = handle;
    this.position.x = Math.random() * 400 - 200;
    this.position.y = Math.random() * 400 - 200;
    //Create a list of existing connected players
    let existingPlayers = [];
    this.playerManager.getAllPlayersInGame().forEach(value => {
      existingPlayers.push({
        id: value.id,
        handle: value.handle,
        character: value.character,
        x: value.position.x,
        y: value.position.y,
        motionVector: value.position.motionVector
      });
    });

    
    this.socket.join('game'); //Join the game room. This needs to happen after we get the list of players to avoid duplication
    
    //Send player list to new player
    this.socket.emit('existingPlayers', existingPlayers);
    //Notify everyone of this new player
    this.socket.to('game').emit('playerJoined', this.id, this.character, this.handle, this.position.x, this.position.y);
    this.socket.emit('spawn', this.position.x, this.position.y);
  }

  leaveGame() {
    this.socket.leave('game');
    //Store attributes locally
    this.reset();
    this.socket.to('game').emit('playerLeft', this.id);
  }
    
  move(posX, posY, vecX, vecY) {
    this.position.x = posX;
    this.position.y = posY;
    this.position.motionVector = {x: vecX, y: vecY};
    this.socket.to('game').emit('playerMoved', this.id, posX, posY, vecX, vecY);
  }

  fire(posX, posY, toX, toY) {
    this.position.x = posX;
    this.position.y = posY;
    this.socket.to('game').emit('playerFired', this.id, posX, posY, toX, toY);
  }

  hit(posX, posY, damage, hitBy) {
    this.position.x = posX;
    this.position.y = posY;
    this.socket.to('game').emit('playerHit', this.id, posX, posY, damage, hitBy);
  }

  die(posX, posY, killedBy) {
    this.position.x = posX;
    this.position.y = posY;
    this.socket.to('game').emit('playerDied', this.id, posX, posY, killedBy);
  }

  respawn() {
    this.position = {
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      motionVector: {x: 0, y: 0},
      lastUpdate: 0
    };
    //Notify everyone of this new player
    this.socket.to('game').emit('playerJoined', this.id, this.character, this.handle, this.position.x, this.position.y);
    this.socket.emit('spawn', this.position.x, this.position.y);
  }


}