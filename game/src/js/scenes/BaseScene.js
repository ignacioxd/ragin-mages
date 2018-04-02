
export default class BaseScene extends Phaser.Scene {

  constructor(key) {
    super(key);
  }

  changeToScene(key, data = null) {
    this.input.keyboard.removeAllListeners();
    this.input.removeAllListeners();
    this.scene.stop(this.sys.config.key);
    this.scene.start(key, data);
  }
}