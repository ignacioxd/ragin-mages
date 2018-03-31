import BaseScene from './BaseScene';
import Controller from '../util/Controller';
import Character from 'objects/Character';
import DOMModal from 'objects/ui/DOMModal';

export default class GameScene extends BaseScene {

  constructor() {
    super({key: 'GameScene'});
    this.clientId = null;

    this.players = new Map();
    this.localCharacter = null;
  }

  init(data) {
    this.characterType = data.character;
  }

  preload() {

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

    this.input.on('pointerdown', function (event) {
      if (this.localCharacter && event.buttons === 1) {
        let worldX = event.x + event.camera.scrollX * event.camera.zoom;
        let worldY = event.y + event.camera.scrollY * event.camera.zoom;
        this.localCharacter.fire(worldX, worldY, this.clientId);
        this.socket.emit('fire', this.localCharacter.x, this.localCharacter.y, worldX, worldY);
      }
    }, this);

    this.map1 = this.add.tilemap('grass_area');
    this.tileset1 = this.map1.addTilesetImage('Map_tileset', 'map_tiles');
    this.layer1 = this.map1.createStaticLayer('Grass Layer', this.tileset1, -800, -600);
  }

  create() {
    //load config file for socket information
    let serverConfig = this.cache.json.get('config');
    this.socket = io(`${serverConfig.protocol}://${serverConfig.host}:${serverConfig.ioport}`);

    this.socket.on('connect', this.serverConnected.bind(this));
    this.socket.on('setId', this.setId.bind(this));
    this.socket.on('existingPlayers', this.existingPlayers.bind(this));
    this.socket.on('playerJoined', this.playerJoined.bind(this));
    this.socket.on('playerLeft', this.playerLeft.bind(this));
    this.socket.on('spawn', this.spawn.bind(this));
    this.socket.on('move', this.move.bind(this));
    this.socket.on('playerFired', this.playerFired.bind(this));
    this.socket.on('playerDied', this.playerDied.bind(this));
    this.socket.on('playerDisconnected', this.playerDisconnected.bind(this));
  }

  update() {
    if (this.localCharacter) {
      const vector = this.controller.getWASDVector();
      if (this.localCharacter.motionChanged(vector)) {
        this.localCharacter.setMotion(vector);
      }

      if (this.localCharacter.isPositionDifferent(vector) &&
        Date.now() - this.localCharacter.lastEmitPosition >= 75) {
        console.log('Changing position');
        this.localCharacter.lastPosition.x = this.localCharacter.x;
        this.localCharacter.lastPosition.y = this.localCharacter.y;
        this.localCharacter.lastPosition.vector = vector;
        this.localCharacter.lastEmitPosition = Date.now();
        this.socket.emit('move', this.localCharacter.x, this.localCharacter.y, vector.x, vector.y);
      }
    }
  }

  playerHit(projectile, character) {
    projectile.destroy();
    if (character.hit(projectile)) { //If the hit causes the player to die
      this.socket.emit('die', character.x, character.y, projectile.props.owner.id);
      new DOMModal('killed', {
        acceptButtonSelector: '#respawn',
        cancelButtonSelector: '.exit',
        onAccept: (modal) => {
          modal.close();
          this.socket.emit('respawn');
        },
        onCancel: (modal) => {
          modal.close();
          this.socket.emit('leaveGame');
          this.socket.disconnect();
          this.scene.start('TitleScene');
        },
        data: character.stats
      });
      this.localCharacter = null;
    }
  }

  //WebSocket Messages
  serverConnected() {
    console.log('serverConnected');
  }

  setId(id) {
    this.clientId = id;
    this.socket.emit('joinGame', this.characterType, '');
  }

  existingPlayers(existingPlayers) {
    console.log('existingPlayers');
    console.log(existingPlayers);
    existingPlayers.forEach(value => {
      this.playerJoined(value.id, value.character, value.handle, value.x, value.y);
    });
  }

  spawn(x, y) {
    this.localCharacter = new Character(this, x, y, this.characterType);
    this.characters.add(this.localCharacter); //this is us.
    this.cameras.main.startFollow(this.localCharacter);
  }

  playerJoined(id, character, handle, x, y) {
    character = character == 'priest' ? 'priest_hero' : character; //Temp fix for compatibility with old clients
    console.log('playerJoined');
    if (this.clientId !== id) {
      let remotePlayer = new Character(this, x, y, character);
      this.players.set(id, remotePlayer);
      remotePlayer.id = id;
      //remotePlayer.setHandle(handle);
    }
    else {
      console.log('this should never happen!!!!!');
    }
  }

  playerLeft(id) {
    console.log('playerLeft');
    let player = this.players.get(id);
    if (!player) return;
    player.die();
  }

  move(id, x, y, vecX, vecY) {
    console.log('move');
    let player = this.players.get(id);
    if (!player) return;
    player.setPosition(x, y);
    player.setOrientationState(new Phaser.Math.Vector2(vecX, vecY));
  }

  playerFired(id, fromX, fromY, toX, toY) {
    console.log('playerFired');
    let player = this.players.get(id);
    if (!player) return;
    player.setPosition(fromX, fromY);
    let projectile = player.fire(toX, toY);
    this.projectiles.add(projectile);
  }

  playerDied(id, posX, posY, killedById) {
    if (killedById == this.clientId) {
      this.localCharacter.stats.kills++;
    }
    console.log('playerDied');
    let player = this.players.get(id);
    if (!player) return;
    player.setPosition(posX, posY);
    player.die();
  }

  playerDisconnected(id) {
    let player = this.players.get(id);
    if (!player) return;
    this.characters.remove(player);
    this.players.delete(id);
    player.die();
  }
}