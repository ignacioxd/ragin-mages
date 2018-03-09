import FireMonster from 'objects/FireMonster';
import IceMonster from 'objects/IceMonster';
import SpiderMonster from 'objects/SpiderMonster';

export default class DemoScene extends Phaser.Scene {

  constructor() {
    super({ key: 'DemoScene' });
  }

  preload() {
    this.add.text(-390, -300, 'Use the arrow keys for motion, spacebar to attack, k to die', {
      font: '16px Arial',
      fill: '#ffffff'
    });
    this.map1 = this.add.tilemap('grass_area');
    this.tileset1 = this.map1.addTilesetImage('Map_tileset', 'map_tiles');
    this.layer1 = this.map1.createStaticLayer('Grass Layer', this.tileset1, -800, -600);
  }

  create() {
    

    this.fireMonster = new FireMonster(this, -100, 0);
    this.iceMonster = new IceMonster(this, 100, 0);
    this.spiderMonster = new SpiderMonster(this, -300, 0);

    this.cameras.main.startFollow(this.fireMonster);

    this.fightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.deathKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.cursors = this.input.keyboard.createCursorKeys();

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

  }
}