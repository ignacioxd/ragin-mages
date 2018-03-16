export default class Controller {
  constructor(scene) {
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    
  }

  getWASDCoordinate() {
    let direction = this.cursors.down.isDown ? 'S' : (this.cursors.up.isDown ? 'N' : '');
    direction += this.cursors.left.isDown ? 'W' : (this.cursors.right.isDown ? 'E' : '');

    direction += this.keyA.isDown ? 'W' : (this.keyD.isDown ? 'E' : '');
    direction += this.keyW.isDown ? 'N' : (this.keyS.isDown ? 'S' : '');
    return direction;
  }

  getWASDVector() {
    let x = 0;
    let y = 0;

    if (this.cursors.up.isDown) {
      y = -1;

    }
    if (this.cursors.down.isDown) {
      y += 1;
    }
    if (this.keyW.isDown) {
      y += -1;
    }
    if (this.keyS.isDown) {
      y += 1;
    }

    if (this.cursors.left.isDown) {
      x = -1;
    }
    if (this.cursors.right.isDown) {
      x += 1;
    }
    if (this.keyA.isDown) {
      x += -1;
    }
    if (this.keyD.isDown) {
      x += 1;
    }

    return new Phaser.Math.Vector2(x, y).normalize();
  }


}