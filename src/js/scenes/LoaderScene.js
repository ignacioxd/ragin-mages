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
    this.load.spritesheet('fire_monster', 'spritesheets/fire_monster.png', { frameWidth: 300, frameHeight: 295 });
  }

  create() {
    this.scene.start('TitleScene');
  }

}