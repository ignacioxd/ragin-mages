import Projectile from 'objects/Projectile';

export default class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, options = {}) {
    super(scene, x, y, key);
    
    //pull specific character config information from characters.json
    this.props= {
      type: key,
      motionVector: new Phaser.Math.Vector2(0, 0),
      ...scene.cache.json.get('characters')[key],
      ...options
    };
    
    /*
    This was an attempt to have accuracy and timeAlive as calculated properties
    this worked when output immediately after creation
    but didn't work when passed into DOMModal
    when passed in I would get "cannot access kills on undefined"
    so it seems to be a scope/this issue, but not sure how to solve

    var stats={
      kills :0,
      shots: 0,
      accuracy2() {return this.shots>0 ? Math.round(this.kills/this.shots * 100 * 100) / 100 : 0},
      accuracy:0,
      timeBorn: Date.now(),
      timeAlive2() {return Math.round((Date.now() - this.timeBorn) / 1000 * 10)/10},
      timeAlive:0,
      HighestRanking: 'Coming Soon',
      HitsReceived: 0
    };
    this.stats=stats;
    console.log(this.stats.accuracy2); // outputs function definition
    console.log(this.stats.accurracy2()) //outputs numeric value
  */
    this.stats = {
      kills :0,
      shots: 0,
      accuracy:0,
      timeBorn: Date.now(),
      timeAlive:0,
      HighestRanking: 'Coming Soon',
      HitsReceived: 0
    };

    scene.physics.world.enable(this);
    
    //make the physics body a circle instead of box
    this.body.isCircle = true;
    //set the size based on the constructor parameter set from the scene constructor
    this.body.setCircle(this.props.collider.size);
    //unique offset for each character to make collider fit properly
    this.setOffset(this.props.collider.offset.x, this.props.collider.offset.y);
    this.scene = scene;
    this.isFiring = false;
    this.isDead = false;
    this.setScale(this.props.scale);
    this.setAnimation('stance', this.props.orientation);
    scene.add.existing(this);
  }

  setAnimation(animation, orientation, force = false) {
    if(!force && (this.isDead || this.isFiring)) return;
    orientation = orientation ? orientation : this.props.orientation;
    this.props.orientation = orientation;
    this.anims.play(`${this.props.type}-${animation}-${orientation}`, true);
  }

  motionChanged(vector) {
    return this.props.motionVector.x !== vector.x || this.props.motionVector.y !== vector.y;
  }

  /**
   * Moves the character in the specified direction and animates it appropriately
   * @param {Vector2} vector Specifies the direction of motion
   */
  setMotion(vector) {
    if(this.isDead || this.isFiring) return;
    this.props.motionVector = vector;
    this.setVelocity(vector.x * this.props.baseSpeed, vector.y * this.props.baseSpeed);
    let animation = 'stance';
    if(vector.length() != 0) {
      animation = 'walk';
      this.props.orientation = this.getOrientation();
    }
    
    this.setAnimation(animation, this.props.orientation);
  }

  setPositionWithVector(vector) {
      if(this.isDead || this.isFiring) return;
      this.props.motionVector = vector;
      let animation = 'stance';
      if(vector.length() != 0) {
          animation = 'walk';
          this.props.orientation = this.getOrientation();
      }

      this.setAnimation(animation, this.props.orientation);
  }

  fire(targetX, targetY,id) {
    if(this.isDead || this.isFiring) return;
    this.stats.shots ++;
    this.setAnimation('fight', this.props.orientation);
    this.isFiring = true;
    this.setVelocity(0, 0);
    let fireFromX = this.x + this.props.projectile.fireOffset.x * this.props.scale;
    let fireFromY = this.y + this.props.projectile.fireOffset.y * this.props.scale;
    let projectile = new Projectile(this.scene, fireFromX, fireFromY, this.props.projectile.type, targetX, targetY, {range: this.props.projectile.baseRange,id: id});
    return projectile;
  }

  die() {
    this.isDead = true;

    this.stats.accuracy= this.stats.shots>0 ? Math.round(this.stats.kills/this.stats.shots * 100 * 100) / 100 : 0;
    this.stats.timeAlive=Math.round((Date.now() - this.stats.timeBorn) / 1000 * 10)/10;
    this.setAnimation('death', this.props.orientation, true);
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
              frameRate: 10,
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
      character.setAnimation('stance', character.orientation);
    }
    else if(animation.key.includes('death')) {
      character.destroy();
    }
  }

  getOrientation() {
    const vector = this.props.motionVector;
    return  (vector.y > 0 ? 'S' : (vector.y < 0 ? 'N' : '')) +
        (vector.x > 0  ? 'E' : (vector.x < 0  ? 'W' : ''));
  }

  isPositionDifferent(x, y, vector) {
    return x !== this.x ||
        y !== this.y ||
        !vector.equals(this.props.motionVector);
  }
}