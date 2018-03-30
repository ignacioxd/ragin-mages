import BaseScene from './BaseScene';
import Character from 'objects/Character';

export default class DungeonScene extends BaseScene {

  constructor() {
    super({ key: 'DungeonScene' });
  }

  preload() {
    
    this.map1 = this.add.tilemap('dungeon_map');
    this.tileset1 = this.map1.addTilesetImage('stone-tiles', 'stone-tiles');
    this.layer1 = this.map1.createStaticLayer('Dungeon Map', this.tileset1, -500, -340);

    this.add.text(-390, -300, 'Dungeon Scene - Use the arrow keys for motion, spacebar to attack, k to die', {
      font: '16px Arial',
      fill: '#ffffff'
    });
  }

  create() {
    

    this.fireMonster = new Character(this, -100, 0, 'fire_monster');
    this.iceMonster = new Character(this, 100, -100, 'ice_monster');
    this.spiderMonster = new Character(this, -300, 100, 'spider_monster');
    this.golemMonster = new Character(this, -300, -100, 'golem_monster');

    this.cameras.main.startFollow(this.fireMonster);

    this.fightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.deathKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on('pointerdown', function(event) {
      if(event.buttons === 1) {
        this.fireMonster.moveTo(this.input.x, this.input.y);
      }
    }, this)

  }

  update() {
    let direction = null;
    let animation = 'walk';
    if (this.cursors.up.isDown) {
      direction = 'N';
      if (this.cursors.left.isDown) { //NW
        direction += 'W';
      }
      else if (this.cursors.right.isDown) { //NE
        direction += 'E';
      }
    }
    else if (this.cursors.down.isDown) {
      direction = 'S';
      if (this.cursors.left.isDown) { //NW
        direction += 'W';
      }
      else if (this.cursors.right.isDown) { //NE
        direction += 'E';
      }
    }
    else if (this.cursors.left.isDown) { //W
      direction = 'W';
    }
    else if (this.cursors.right.isDown) { //E
      direction = 'E';
    }
    else {
      animation = 'stance';
    }

    if(this.fightKey.isDown) {
      animation = 'fight';
    }

    if(this.deathKey.isDown) {
      animation = 'death';
    }

    this.iceMonster.setAnimation(animation, direction);
    this.fireMonster.setAnimation(animation, direction);
    this.spiderMonster.setAnimation(animation, direction);
    this.golemMonster.setAnimation(animation, direction);

    this.fireMonster.update();
  }
}