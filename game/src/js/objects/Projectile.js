export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, targetX, targetY, options = {}) {
    super(scene, x, y, key);

    this.props = {
      ...{
        type: key,
        scale: .4,
        speed: 250,
        motionVector: new Phaser.Math.Vector2(targetX, targetY).subtract({x: x, y: y}).normalize(),
        range: 1000
      },
      ...options};

    this.anims.play(`proj_${key}-E`, true);

    // Dynamically modify this sprite based on the type of projectile
    this.setSizeToFrame(scene.anims.anims.entries[`proj_${key}-E`].frames[0]);

    // Enable physics first to allow other transformations to apply to the physics layer
    scene.physics.world.enable(this);
    // Set the size of the collider based on the type of projectile
    this.setColliderSize(key);

    this.setRotation(this.props.motionVector.angle());
    this.setVelocity(this.props.motionVector.x * this.props.speed, this.props.motionVector.y * this.props.speed);

    this.setScale(this.props.scale);

    scene.add.existing(this);

    scene.add.tween({
      targets: this,
      alpha: 0.4,
      ease: 'Linear',
      delay: 0,
      duration: this.props.range,
      onComplete: this._rangeReached,
      onCompleteParams: [ this ]
    });
    
  }

  _rangeReached(tween, targets, projectile) {
    projectile.destroy();
  }  

  setColliderSize(projectileType){
    switch(projectileType){

    case 'orb' :
      this.body.setCircle(20);
      break;
      
    case 'orb_p' :
      this.body.setCircle(15);
      break;
      
    case 'ven' :
      this.body.setCircle(10);
      break;
      
    case 'fire' :
      this.body.setCircle(30);
      break;
      
    case 'light' :
      this.body.setCircle(20);
      break;
      
    case 'ice' :
      this.body.setCircle(20);
      break;
      
    case 'rock' :
      this.body.setCircle(20);
      break;
   
    }
  }
  
  static buildAnimations(scene) {
    if(!this.animationsCreated) {
      const coordinates = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const animations = [
        {
          name: 'orb', frames: 6
        },
        {
          name: 'orb_p', frames: 6
        },
        {
          name: 'ven', frames: 6
        },
        {
          name: 'fire', frames: 6
        },
        {
          name: 'light', frames: 6
        },
        {
          name: 'ice', frames: 6
        },
        {
          name: 'rock', frames: 6
        }
      ];

      for (const animation of animations) {
        for (const coordinate of coordinates) {
          let animFrames = scene.anims.generateFrameNames('projectiles', {
            start: 1, end: animation.frames, zeroPad: 4,
            prefix: `proj_${animation.name}/${coordinate}/`, suffix: ''
          });
          scene.anims.create({ key: `proj_${animation.name}-${coordinate}`, frames: animFrames, frameRate: 7, repeat: -1 });
        }
      }
      this.animationsCreated = true;
    }
  }
}