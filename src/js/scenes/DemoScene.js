import Character from 'objects/Character';

export default class DemoScene extends Phaser.Scene {

  constructor() {
    super({key: 'DemoScene'});
  }

  preload() {
    this.anims.create({
      key: 'walk_soldier',
      frames: [
        { frame: 36, key: 'soldier' },
        { frame: 37, key: 'soldier' },
        { frame: 38, key: 'soldier' },
        { frame: 39, key: 'soldier' },
        { frame: 40, key: 'soldier' },
        { frame: 41, key: 'soldier' }
      ],
      frameRate: 8,
      yoyo: false,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_fire_monster',
      frames: [
        { frame: 107, key: 'fire_monster' },
        { frame: 108, key: 'fire_monster' },
        { frame: 109, key: 'fire_monster' },
        { frame: 110, key: 'fire_monster' },
        { frame: 111, key: 'fire_monster' },
        { frame: 112, key: 'fire_monster' }
      ],
      frameRate: 8,
      yoyo: false,
      repeat: -1
    });
  }

  create() {

    let char = new Character(this, 0,  0, 'soldier');


    new Character(this, 200,  0, 'fire_monster');

    this.cameras.main.startFollow(char);
  }

}