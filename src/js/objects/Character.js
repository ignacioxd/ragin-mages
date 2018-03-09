export default class Character extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.lastOrientation = 'E';

    this.speed = 5;

    this.motion = {
      moving: false,
      moveTo: {
        x: x,
        y: y
      }
    };
  }

  buildAnimations(scene) {
    const coordinates = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const animations = [
      {
        name: 'stance', frames: 6
      },
      {
        name: 'death', frames: 6
      },
      {
        name: 'fight', frames: 8
      },
      {
        name: 'walk', frames: 6
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

  moveTo(x, y) {
    console.log('Original pos', this.x, this.y);
    console.log('Move to pos', x, y);
    this.motion.moveTo.x = Math.round(this.x + x - 400);
    this.motion.moveTo.y = Math.round(this.y + y - 300);
    this.motion.moving = true;
  }

  update() {
    if(this.motion.moving) {
      let dx = this.motion.moveTo.x - this.x;
      if(dx !== 0) {
        this.x += Math.ceil(dx / Math.abs(dx)); 
      }
            
      let dy = this.motion.moveTo.y - this.y;
      if(dy !== 0) {
        this.y += Math.ceil(dy / Math.abs(dy)); 
      }
      

      if(this.x == this.motion.moveTo.x && this.y == this.motion.moveTo.y) {
        this.stop();
      }
    }
  }

  stop() {
    this.motion.moving = false;
  }

}