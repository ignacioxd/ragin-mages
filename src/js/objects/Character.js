export default class Character extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.lastOrientation = 'E';
  }

  buildAnimations(scene) {
    const coordinates = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const animations = [
      {
        name: 'stance',
        frames: 6
      },
      {
        name: 'death',
        frames: 6
      },
      {
        name: 'fight',
        frames: 8
      },
      {
        name: 'walk',
        frames: 6
      },
    ];


    for (const animation of animations) {
      for (const coordinate of coordinates) {
        let animFrames = scene.anims.generateFrameNames(this.type, {
          start: 1, end: animation.frames, zeroPad: 4,
          prefix: `${animation.name}/${coordinate}/`, suffix: ''
        });
        scene.anims.create({ key: `${this.type}-${animation.name}-${coordinate}`, frames: animFrames, frameRate: 7, repeat: -1 });
      }
    }
  }

  setAnimation(animation, orientation) {
    orientation = orientation ? orientation : this.lastOrientation;
    this.lastOrientation = orientation;
    this.anims.play(`${this.type}-${animation}-${orientation}`, true);
  }
}