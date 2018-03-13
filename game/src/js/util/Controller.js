export default class Controller {
  constructor(scene) {
    this.cursors = scene.input.keyboard.createCursorKeys();

    
  }

  getWASDCoordinate() {
    let direction = this.cursors.down.isDown ? 'S' : (this.cursors.up.isDown ? 'N' : '');
    direction += this.cursors.left.isDown ? 'W' : (this.cursors.right.isDown ? 'E' : '');
    return direction;
  }

  getWASDVector() {
    let x = this.cursors.left.isDown ? -1 : (this.cursors.right.isDown ? 1 : 0);
    let y = this.cursors.up.isDown ? -1 : (this.cursors.down.isDown ? 1 : 0);
    return new Phaser.Math.Vector2(x, y).normalize();
  }


}