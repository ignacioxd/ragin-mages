export default class LoaderScene extends Phaser.Scene {

  constructor() {
    super({key: 'LoaderScene'});
  }

  preload() {
    console.log(this.constructor.name);
    this.load.setBaseURL('./assets/');
    this.load.json('assets');
    
    this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
    this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png');
    this.load.image('red', 'http://labs.phaser.io/assets/particles/red.png');

    // Assets from https://opengameart.org/content/dungeon-crawl-32x32-tiles
    this.load.image('grid_pointer', 'sprites/grid_pointer.png');
    this.load.image('grid_slot', 'sprites/slot_cursed.png');

    this.load.spritesheet('soldier', 'spritesheets/soldier.png', { frameWidth: 300, frameHeight: 300 });

    this.load.atlas('fire_monster', 'spritesheets/fire_monster.png', 'spritesheets/fire_monster.json');
    this.load.atlas('ice_monster', 'spritesheets/ice_monster.png', 'spritesheets/ice_monster.json');
    this.load.atlas('spider_monster', 'spritesheets/spider_monster.png', 'spritesheets/spider_monster.json');
    this.load.atlas('golem_monster', 'spritesheets/golem_monster.png', 'spritesheets/golem_monster.json');

    this.load.tilemapTiledJSON('grass_area', 'maps/map.json');
    this.load.image('map_tiles', 'maps/map_tiles.png');
    this.load.tilemapTiledJSON('dungeon_map', 'maps/dungeon_map.json')
    this.load.image('stone-tiles', 'maps/stone-tiles.jpg');
  }

  create() {
    this.scene.start('TitleScene');
    console.log(this.cache.json.get('assets'));
  }
}
