export default class LoaderScene extends Phaser.Scene {

  constructor() {
    super({key: 'LoaderScene'});
  }

  preload() {
    console.log(this.constructor.name);
    this.load.setBaseURL('./assets/');

    this.progress = this.add.graphics();

    this.load.on('start', this.loadStart, this);
    this.load.on('progress', this.loadProgress, this);
    this.load.on('fileprogress', this.loadFileProgress, this);
    this.load.on('complete', this.loadCompleted, this);
    
    this.load.start();
  }

  create() {
  }

  /**
   * Called when the loader has started loading assets.
   * @param {object} loader Instance of the global Phaser loader.
   */
  loadStart(loader) {
    loader.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
    loader.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png');
    loader.image('red', 'http://labs.phaser.io/assets/particles/red.png');

    // Assets from https://opengameart.org/content/dungeon-crawl-32x32-tiles
    loader.image('grid_pointer', 'sprites/grid_pointer.png');
    loader.image('grid_slot', 'sprites/slot_cursed.png');

    loader.spritesheet('soldier', 'spritesheets/soldier.png', { frameWidth: 300, frameHeight: 300 });

    //Characters
    loader.atlas('fire_monster', 'spritesheets/fire_monster.png', 'spritesheets/fire_monster.json');
    loader.atlas('ice_monster', 'spritesheets/ice_monster.png', 'spritesheets/ice_monster.json');
    loader.atlas('spider_monster', 'spritesheets/spider_monster.png', 'spritesheets/spider_monster.json');
    loader.atlas('golem_monster', 'spritesheets/golem_monster.png', 'spritesheets/golem_monster.json');
    loader.atlas('priest_hero', 'spritesheets/priest_hero.png', 'spritesheets/priest_hero.json');
    loader.atlas('knight_hero', 'spritesheets/knight_hero.png', 'spritesheets/knight_hero.json');

    loader.tilemapTiledJSON('grass_area', 'maps/map.json');
    loader.image('map_tiles', 'maps/map_tiles.png');
    loader.tilemapTiledJSON('dungeon_map', 'maps/dungeon_map.json')
    loader.image('stone-tiles', 'maps/stone-tiles.jpg');
  }

  /**
   * Keeps track of individual file loading progress.
   * @param {object} file File currently being loaded
   * @param {float} value Percentage of load of this file ranging from 0 to 1.
   */
  loadFileProgress(file, value) {
  }

  /**
   * Keeps track of global loading process.
   * @param {float} value Percentage of load progress. Appears to be currently broken in Phaser 3.
   */
  loadProgress(value) {
    this.progress.clear();
    this.progress.fillStyle(0xffffff, 1);
    this.progress.fillRect(0, 270, 800 * value, 60);
  }

  /**
   * Called when the loader has completed loading all assets.
   */
  loadCompleted() {
    this.progress.destroy();
    this.scene.start('TitleScene');
  }
}
