import Projectile from '../Projectile';
import jsonPath from '../../util/jsonpath-0.8.0';

export default class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, options = {}) {
    super(scene, x, y, key);
    const filter=`$..characters[?(@.key =="${key}")]`;
    // let filter2="$..characters[?(@.key =='knight_hero')]";
    // let filter3='$..characters[?(@.baseSpeed ==200)]';
    // console.log(filter);
    this.config=jsonPath(scene.cache.json.get('characters'), filter)[0];
    this.props={
      type: key,
      motionVector: new Phaser.Math.Vector2(0, 0),
      ...this.config,
      ...options
    };
    console.log(this.config);
    console.log(this.props);
    console.log(this.config.key);
    console.log(this.props.key);
    
    // this.props = {
    //   ...{
    //     type: key,
    //     scale: 0.35,
    //     lastOrientation: 'E',
    //     motionVector: new Phaser.Math.Vector2(0, 0),
    //     speed: 200,
    //     projectileType: 'fire',
    //     projectileRange: 1000,
    //     projectileFireOffset: {x: 0, y: -150},
    //     colliderSize: 70,
    //     colliderOffsetX: 0,
    //     colliderOffsetY: 0
    //   },
    //   ...options
    // };


    scene.physics.world.enable(this);
    //scene.characters.add(this);
    //make the physics body a circle instead of box
    this.body.isCircle = true;
    //set the size based on the constructor parameter set from the scene constructor
    this.body.setCircle(this.props.collider.size);
    console.log(this.props.collider.size);
    //unique offset for each character to make collider fit properly
    this.setOffset(this.props.collider.offset.x, this.props.collider.offset.y);
    console.log(this.props.collider.offset.x,this.props.collider.offset.y);
    this.scene = scene;
    this.isFiring = false;
    this.isDead = false;
    this.setScale(this.props.scale);
    console.log(this.props.scale);
    this.setAnimation('stance', this.props.orientation);
    console.log(this.props.orientation);
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
      this.props.orientation = vector.y > 0 ? 'S' : (vector.y < 0 ? 'N' : '');
      this.props.orientation += vector.x > 0  ? 'E' : (vector.x < 0  ? 'W' : '');
    }
    
    this.setAnimation(animation, this.props.orientation);
    
  }

  fire(targetX, targetY) {
    if(this.isDead || this.isFiring) return;
    this.setAnimation('fight', this.props.orientation);
    this.isFiring = true;
    this.setVelocity(0, 0);
    let fireFromX = this.x + this.props.projectile.fireOffset.x * this.props.scale;
    let fireFromY = this.y + this.props.projectile.fireOffset.y * this.props.scale;
    let projectile = new Projectile(this.scene, fireFromX, fireFromY, this.props.projectile.type, targetX, targetY, {range: this.props.projectile.baseRange});
    return projectile;
  }

  die() {
    this.isDead = true;
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
}