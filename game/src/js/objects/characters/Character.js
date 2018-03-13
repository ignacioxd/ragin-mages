import Projectile from '../Projectile';

export default class Character extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene = scene;
    this.lastOrientation = 'E';
    this.projectileType = 'fire';

    this.speed = 5;

    this.motion = {
      moving: false,
      moveTo: {
        x: x,
        y: y
      }
    };
    this.setScale(.35);
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
        name: 'fight', frames: 6
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
      let orientationNS = '';
      let orientationEW = '';

      let dx = this.motion.moveTo.x - this.x;
      if(dx !== 0) {
        this.x += Math.ceil(dx / Math.abs(dx));
        orientationEW = dx > 0 ? 'E' : 'W';
      }
            
      let dy = this.motion.moveTo.y - this.y;
      if(dy !== 0) {
        this.y += Math.ceil(dy / Math.abs(dy));
        orientationNS = dy < 0 ? 'N' : 'S';
      }
      
      this.setAnimation('walk', orientationNS + orientationEW);

      if(this.x == this.motion.moveTo.x && this.y == this.motion.moveTo.y) {
        this.stop();
      }
    }
  }

  stop() {
    this.motion.moving = false;
    this.setAnimation('stance');
  }

  fire(targetX, targetY) {
    new Projectile(this.scene, this.x, this.y, this.projectileType, targetX, targetY);
  }

}