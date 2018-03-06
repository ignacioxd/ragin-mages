export default class LoaderScene extends Phaser.Scene {

  constructor() {
    super({key: 'LoaderScene'});
  }

  preload() {
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
  }

  create() {
    this.scene.start('DemoScene');
  }

}