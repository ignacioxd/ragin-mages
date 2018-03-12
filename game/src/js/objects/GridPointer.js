export default class GridPointer extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'grid_pointer');

    scene.add.existing(this);
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }
}