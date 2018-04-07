import Server from 'util/Server';

export default class BaseScene extends Phaser.Scene {

  constructor(key) {
    super(key);
    this.server = new Server();
  }

  changeToScene(key, data = null) {
    this.scene.manager.keys.GamepadScene.stop();
    this.input.keyboard.removeAllListeners();
    this.input.removeAllListeners();
    this.server.removeAllListeners();
    this.scene.stop(this.sys.config.key);
    this.scene.start(key, data);
  }

  scaleToFit(width = 700, height = 650) {
    let scaleX = window.innerWidth < width ? window.innerWidth / width : 1;
    let scaleY = window.innerHeight < height ? window.innerHeight / height : 1;
    if(scaleX < scaleY) {
      this.cameras.main.setZoom(scaleX);
    }
    else if(scaleY < scaleX) {
      this.cameras.main.setZoom(scaleY);
    }
  }
}