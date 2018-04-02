import Server from 'util/Server';

export default class BaseScene extends Phaser.Scene {

  constructor(key) {
    super(key);
    this.server = new Server();
  }

  changeToScene(key, data = null) {
    this.input.keyboard.removeAllListeners();
    this.input.removeAllListeners();
    this.server.removeAllListeners();
    this.scene.stop(this.sys.config.key);
    this.scene.start(key, data);
  }
}