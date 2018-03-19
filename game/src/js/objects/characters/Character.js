import Projectile from '../Projectile';

export default class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, colSize, offsetX, offsetY) {
    super(scene, x, y, key);
    scene.physics.world.enable(this);
    scene.characters.add(this);
    //make the physics body a circle instead of box
    this.body.isCircle = true;
    //set the size based on the constructor parameter set from the scene constructor
    this.body.setCircle(colSize);
    //unique offset for each character to make collider fit properly
    this.setOffset(offsetX, offsetY);
    this.scene = scene;
    this.lastOrientation = 'E';
    this.projectileType = 'fire';
    this.isFiring = false;
    this.isDead = false;
    this.speed = 100;
    this.motionVector = new Phaser.Math.Vector2(0, 0);
    this.setScale(.35);
    this.type = key;
  }

  setAnimation(animation, orientation, force = false) {
    if(!force && (this.isDead || this.isFiring)) return;
    orientation = orientation ? orientation : this.lastOrientation;
    this.lastOrientation = orientation;
    this.anims.play(`${this.type}-${animation}-${orientation}`, true);
  }

  motionChanged(vector) {
    return this.motionVector.x !== vector.x || this.motionVector.y !== vector.y;
  }
  
  /**
   * Moves the character in the specified direction and animates it appropriately
   * @param {Vector2} vector Specifies the direction of motion
   */
  setMotion(vector) {
    if(this.isDead || this.isFiring) return;
    this.motionVector = vector;
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
    if(this.isDead || this.isFiring) return;
    this.setAnimation('fight', this.lastOrientation);
    this.isFiring = true;
    this.setVelocity(0, 0);
    let projectile = new Projectile(this.scene, this.x, this.y, this.projectileType, targetX, targetY);
    this.scene.projectiles.add(projectile);
  }

  die() {
    this.isDead = true;
    this.setAnimation('death', this.lastOrientation, true);
    this.setVelocity(0, 0);
  }

  static buildAnimations(scene) {
    if(!this.animationsCreated) {
      const characterTypes = ['fire_monster', 'golem_monster', 'ice_monster', 'knight_hero', 'mage_hero', 'priest_hero', 'spider_monster'];
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

      for(const characterType of characterTypes) {
        for(const animation of animations) {
          for(const coordinate of coordinates) {
            let animFrames = scene.anims.generateFrameNames(characterType, {
              start: 1, end: animation.frames, zeroPad: 4,
              prefix: `${animation.name}/${coordinate}/`, suffix: ''
            });
            scene.anims.create({
              key: `${characterType}-${animation.name}-${coordinate}`,
              frames: animFrames,
              frameRate: 7,
              repeat: -1,
              onComplete: Character.animationCompleted,
              onRepeat: Character.animationLoop
            });
          }
        }
      }
      this.animationsCreated = true;
    }
  }

  static animationLoop(character, animation) {
    if(animation.key.includes('fight')) {
      character.isFiring = false;
      character.setAnimation('stance', character.lastOrientation);
    }
    else if(animation.key.includes('death')) {
      character.destroy();
    }
  }
}