export default class BootScene extends Phaser.Scene {

  constructor() {
    super({key: 'BootScene'});
  }

  preload() {
    this.load.setBaseURL('./assets/');
    this.load.json('assets');
    this.load.json('config','../config.json');
  }

  create() {
    this.scene.start('LoaderScene');
  }

}
