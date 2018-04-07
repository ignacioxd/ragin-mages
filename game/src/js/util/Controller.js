export default class Controller {
  constructor(scene) {
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.addWASDKeys(scene);
    this.addVirtualKeys();
  }

  addWASDKeys(scene) {
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  addVirtualKeys() {
    this.virtualKeys = {
      up: { isDown: false },
      down: { isDown: false },
      left: { isDown: false },
      right: { isDown: false }
    };
  }

  setVirtualKeys(keys) {
    this.virtualKeys = keys;
  }

  getWASDCoordinate() {
    let direction = this.cursors.down.isDown || this.keyS.isDown || this.virtualKeys.down.isDown
      ? 'S' : (this.cursors.up.isDown || this.keyW.isDown || this.virtualKeys.up.isDown ? 'N' : '');
    direction += this.cursors.left.isDown || this.keyA.isDown || this.virtualKeys.left.isDown
      ? 'W' : (this.cursors.right.isDown || this.keyD.isDown || this.virtualKeys.right.isDown ? 'E' : '');

    return direction;
  }

  getWASDVector() {
    let x = 0;
    let y = 0;

    if(this.cursors.up.isDown || this.keyW.isDown || this.virtualKeys.up.isDown) {
      y = -1;

    }
    if(this.cursors.down.isDown || this.keyS.isDown || this.virtualKeys.down.isDown){
      y += 1;
    }

    if(this.cursors.left.isDown || this.keyA.isDown || this.virtualKeys.left.isDown) {
      x = -1;
    }
    if(this.cursors.right.isDown || this.keyD.isDown || this.virtualKeys.right.isDown) {
      x += 1;
    }

    return new Phaser.Math.Vector2(x, y).normalize();
  }


}