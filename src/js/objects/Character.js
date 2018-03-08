export default class Character extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    
    scene.add.existing(this);
    scene.anims.create({
      key: 'walk',
      frames: [
        { frame: 36, key: 'soldier' },
        { frame: 37, key: 'soldier' },
        { frame: 38, key: 'soldier' },
        { frame: 39, key: 'soldier' },
        { frame: 40, key: 'soldier' },
        { frame: 41, key: 'soldier' }
      ],
      frameRate: 8,
      yoyo: false,
      repeat: -1
    });

    this.anims.play('walk');

  }
}