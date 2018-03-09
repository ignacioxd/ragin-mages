export default class LoaderScene extends Phaser.Scene {

  constructor() {
    super({key: 'LoaderScene'});
  }

  preload() {
    console.log(this.constructor.name);
    this.load.setBaseURL('./assets/');

    this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
    this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png');
    this.load.image('red', 'http://labs.phaser.io/assets/particles/red.png');

    this.load.spritesheet('soldier', 'spritesheets/soldier.png', { frameWidth: 300, frameHeight: 300 });

    this.load.atlas('fire_monster', 'spritesheets/fire_monster.png', 'spritesheets/fire_monster.json');
    this.load.atlas('ice_monster', 'spritesheets/ice_monster.png', 'spritesheets/ice_monster.json');
    this.load.atlas('spider_monster', 'spritesheets/spider_monster.png', 'spritesheets/spider_monster.json');

    this.load.tilemapTiledJSON('grass_area', 'spritesheets/map.json')
    this.load.image('map_tiles', 'spritesheets/map_tiles.png');
  }

  create() {
    this.scene.start('TitleScene');
  }

}
