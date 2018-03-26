import BaseScene from './BaseScene';
import Controller from '../util/Controller';
import Priest from 'objects/characters/Priest';

export default class GameScene extends BaseScene {

  constructor() {
    super({ key: 'GameScene' });
    this.clientId = null;

    this.players = new Map();
    this.localCharacter = null;
  }

  preload() {

    //load config file for socket information
    this.config=this.cache.json.get('config');
    
    //Create collision groups and event handling
    this.projectiles = this.add.group();
    this.characters = this.add.group();
    this.physics.add.overlap(this.projectiles, this.characters, this.playerHit, null, this);


    this.controller = new Controller(this);
    this.input.keyboard.on('keydown_ESC', function () {
      if (this.sys.isActive()) this.sys.pause();
      else this.sys.resume();
    }, this);

    this.input.keyboard.on('keydown_Q', function () {
      const sampleDialog = 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...';
      this.sys.game.scene.keys.DialogScene.setDialogText(sampleDialog);
    }, this);

    this.input.keyboard.on('keydown_PLUS', function () {
      this.cameras.main.setZoom(this.cameras.main.zoom + 0.1);
    }, this);

    this.input.keyboard.on('keydown_MINUS', function () {
      this.cameras.main.setZoom(this.cameras.main.zoom - 0.1);
    }, this);

    this.input.on('pointerdown', function(event) {
      if(this.localCharacter && event.buttons === 1) {
        let worldX = event.x + event.camera.scrollX * event.camera.zoom;
        let worldY = event.y + event.camera.scrollY * event.camera.zoom;
        this.localCharacter.fire(worldX, worldY);
        this.socket.emit('fire', this.localCharacter.x, this.localCharacter.y, worldX, worldY);
      }
    }, this);

    this.map1 = this.add.tilemap('grass_area');
    this.tileset1 = this.map1.addTilesetImage('Map_tileset', 'map_tiles');
    this.layer1 = this.map1.createStaticLayer('Grass Layer', this.tileset1, -800, -600);
  }

  create() {
    //TODO: This should be configurable. Change IP to localhost if using a local server
  //  this.socket = io('http://152.46.18.48:443');
    //this.socket = io('http://localhost:3030');
    this.socket = io(this.config.protocol + '://' + this.config.host + ':'  + this.config.ioport);

    this.socket.on('connect', this.serverConnected.bind(this));
    this.socket.on('setId', this.setId.bind(this));
    this.socket.on('existingPlayers', this.existingPlayers.bind(this));
    this.socket.on('playerJoined', this.playerJoined.bind(this));
    this.socket.on('setMotion', this.setMotion.bind(this));
    this.socket.on('setPosition', this.setPosition.bind(this));
    this.socket.on('playerFired', this.playerFired.bind(this));
    this.socket.on('playerDied', this.playerDied.bind(this));
    this.socket.on('playerDisconnected', this.playerDisconnected.bind(this));
  }

  update() {
    if(this.localCharacter) {
      const vector = this.controller.getWASDVector();
      if(this.localCharacter.motionChanged(vector)) {
        console.log('motion changed locally');
        this.localCharacter.setMotion(vector);
        this.socket.emit('setMotion', this.localCharacter.x, this.localCharacter.y, vector.x, vector.y);
      }
    }
  }

  playerHit(projectile, character) {
    projectile.destroy();
    this.socket.emit('death', this.localCharacter.x, this.localCharacter.y);
    character.die();
  }



  //WebSocket Messages
  serverConnected() {
    console.log('serverConnected');
  }

  setId(id) {
    this.clientId = id;
    this.socket.emit('joinGame', 'priest', 'Player1');
  }

  existingPlayers(existingPlayers) {
    console.log('existingPlayers');
    console.log(existingPlayers);
    existingPlayers.forEach(value => {
      this.playerJoined(value.id, value.handle, value.character, value.x, value.y);
    });
  }

  playerJoined(id, handle, character, x, y) {
    console.log('playerJoined');
    //TODO: Choose character based on value.character
    if(this.clientId !== id) {
      let remotePlayer = new Priest(this, x, y);
      this.players.set(id, remotePlayer);
      remotePlayer.id = id;
      //remotePlayer.setHandle(handle);
    }
    else {
      this.localCharacter = new Priest(this, x, y);
      this.characters.add(this.localCharacter); //this is us.
      this.cameras.main.startFollow(this.localCharacter);
    }
  }

  setMotion(id, posX, posY, vecX, vecY) {
    console.log('setMotion');
    let player = this.players.get(id);
    if(!player) return;
    player.setPosition(posX, posY);
    player.setMotion(new Phaser.Math.Vector2(vecX, vecY));
  }

  setPosition(id, x, y, orientation) {
    console.log('setPosition');
    let player = this.players.get(id);
    if(!player) return;
    player.lastOrientation = orientation;
    player.setPosition(x, y);
  }

  playerFired(id, fromX, fromY, toX, toY) {
    console.log('playerFired');
    let player = this.players.get(id);
    if(!player) return;
    player.setPosition(fromX, fromY);
    let projectile = player.fire(toX, toY);
    this.projectiles.add(projectile);
  }

  playerDied(id, posX, posY) {
    console.log('playerFired');
    let player = this.players.get(id);
    if(!player) return;
    player.setPosition(posX, posY);
    player.die();
  }

  playerDisconnected(id) {
    let player = this.players.get(id);
    this.characters.remove(player);
    this.players.delete(id);
    player.destroy();
  }
}