export default class Character extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    
    scene.add.existing(this);
    

    this.anims.play(`walk_${key}`);

  }
}