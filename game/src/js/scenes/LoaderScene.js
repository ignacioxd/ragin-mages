import Character from 'objects/characters/Character';
import Projectile from 'objects/Projectile';

export default class LoaderScene extends Phaser.Scene {

  constructor() {
    super({key: 'LoaderScene'});
  }

  preload() {
    this.assets =  this.cache.json.get('assets');

    this.loadtext = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Loading...', {
      font: '50px Times',
      fill: '#ffffff'
    });
    this.rotAngle = 0;
  }

  create() {

    this.load.setBaseURL('./assets/');
    this.load.on('start', this.loadStart, this);
    this.load.on('progress', this.loadProgress, this);
    this.load.on('fileprogress', this.loadFileProgress, this);
    this.load.on('complete', this.loadCompleted, this);
    
    this.load.start();
  }

  /**
   * Called when the loader has started loading assets.
   * @param {object} loader Instance of the global Phaser loader.
   */
  loadStart(loader) {

    //Load Images
    for(let image of this.assets.image) {
      loader.image(image.key, image.texture);
      //loader.image(image);
    }
    //loader.image(this.assets.image);

    //Load Spritesheets
    for(let spritesheet of this.assets.spritesheet) {
      loader.spritesheet(spritesheet.key, spritesheet.texture, spritesheet);
    }

    //Load Atlas
    for(let atlas of this.assets.atlas) {
      loader.atlas(atlas);
    }

    //Load TileMaps
    for(let tileMap of this.assets.tileMap) {
      loader.tilemapTiledJSON(tileMap.key, tileMap.data);
    }

    /*
      Assets from
      https://opengameart.org/content/dungeon-crawl-32x32-tiles
      https://opengameart.org/content/user-interface-element-pack-panels-buttons-sliders-tables-icons
    */
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
  }

  /**
   * Called when the loader has completed loading all assets.
   */
  loadCompleted() {
    //Build animations
    Character.buildAnimations(this);
    Projectile.buildAnimations(this);
    this.scene.start('TitleScene');
  }

  update() {
    this.rotAngle += 0.1;
    this.loadtext.setRotation(this.rotAngle);
  }
}
