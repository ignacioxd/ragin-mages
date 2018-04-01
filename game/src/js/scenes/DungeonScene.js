import BaseScene from './BaseScene';
import Controller from '../util/Controller';
import Character from 'objects/Character';

export default class DungeonScene extends BaseScene {

  constructor() {
    super({ key: 'DungeonScene' });

    this.localCharacter = null;
  }

  init(data) {
    this.characterType = data.character;
  }

  preload() {

    //Create collision groups and event handling
    this.projectiles = this.add.group();
    this.characters = this.add.group();
    this.physics.add.overlap(this.projectiles, this.characters, null, this);


    this.controller = new Controller(this);
    this.input.keyboard.on('keydown_ESC', function () {
      if(this.sys.isActive()) this.sys.pause();
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
        this.localCharacter.fire(worldX, worldY, this.clientId);
      }
    }, this);

    
    this.map1 = this.add.tilemap('dungeon_map');
    this.tileset1 = this.map1.addTilesetImage('stone-tiles', 'stone-tiles');
    this.layer1 = this.map1.createStaticLayer('Dungeon Map', this.tileset1, -500, -340);

  }

  create() {
    this.spawn(0,0);

  }

  update() {
    if(this.localCharacter) {
      const vector = this.controller.getWASDVector();
      this.localCharacter.setMotion(vector);
    }
  }

  spawn(x, y) {
    this.localCharacter = new Character(this, x, y, this.characterType);
    this.characters.add(this.localCharacter); //this is us.
    this.cameras.main.startFollow(this.localCharacter);
  }
}