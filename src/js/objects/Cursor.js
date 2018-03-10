export default class Cursor extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }
}