import Projectile from '../Projectile';

export default class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    scene.physics.world.enable(this);
    scene.characters.add(this);

    this.scene = scene;
    this.lastOrientation = 'E';
    this.projectileType = 'fire';
    this.body.isCircle = true;
    this.body.setCircle(45,115,115);

    this.speed = 100;

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

  /**
   * Moves the character in the specified direction and animates it appropriately
   * @param {Vector2} vector Specifies the direction of motion
   */
  setMotion(vector) {
    this.setVelocity(vector.x * this.speed, vector.y * this.speed);
    let animation = 'stance';
    if(vector.length() != 0) {
      animation = 'walk';
      this.lastOrientation = vector.y > 0 ? 'S' : (vector.y < 0 ? 'N' : '');
      this.lastOrientation += vector.x > 0  ? 'E' : (vector.x < 0  ? 'W' : '');
    }
    
    this.setAnimation(animation, this.lastOrientation);
  }

  fire(targetX, targetY) {
    let projectile = new Projectile(this.scene, this.x, this.y, this.projectileType, targetX, targetY);
    this.scene.projectiles.add(projectile);
    projectile.body.isCircle = true;
    projectile.body.setCircle(16,10,10);
  }

}