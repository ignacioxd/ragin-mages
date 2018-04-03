import BaseScene from './BaseScene';
import Controller from '../util/Controller';
import Character from 'objects/Character';
import DOMModal from 'objects/ui/DOMModal';

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
      if(this.currentModal) return;
      this.currentModal = new DOMModal(this, 'quitGame', {
        width: 'auto',
        acceptButtonSelector: '.exit',
        cancelButtonSelector: '#stay',
        onAccept: (modal) => {
          modal.close();
          this.currentModal = null;
          this.changeToScene('TitleScene');
        },
        onCancel: (modal) => {
          modal.close();
          this.currentModal = null;
        }
      });
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
    this.delay = 50;
    this.enemyList = [];
    this.virtualTime = 0;
  }

  update() {
    --this.delay;
    ++this.virtualTime;
    if (this.delay <= 0) {
      // Always creates a fire monster for now.  Will add other types later, but it's hard enough getting it working
      // with just one for now.
      const opts = {
    projectileType: 'fire',
    colliderSize: 70,
    colliderOffsetX: 95,
    colliderOffsetY: 60
  }
      var newMonster = new Character(this, 250 * (Math.random() - 0.5), 250 * (Math.random() - 0.5), 'fire_monster', opts);
      newMonster.setAI(this.localCharacter);
      this.enemyList.push(newMonster);
      this.characters.add(newMonster);
      
      // Not sure how to do this.  May be incorrect.
      this.physics.add.overlap(newMonster.projectiles, newMonster, null, this);

      // Set new delay for next monster.  Starts at 1 every 200 updates but increases over time.
      this.delay = 200 - Math.sqrt(this.virtualTime/15);
    }
    
    for (let i = 0; i < this.enemyList.length; ++i) {
      this.enemyList[i].updateAI(); 
    }
    
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
