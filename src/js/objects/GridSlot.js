export default class GridPointer extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, cursor) {
    super(scene, x, y, key);

    this.setInteractive();
    this.on('pointerover', function () {
      cursor.move(this.x, this.y);
      cursor.setVisible(true);
    });
    this.on('pointerout', function () {
      this.clearTint();
      cursor.setVisible(false);
    });

    scene.add.existing(this);
  }
}