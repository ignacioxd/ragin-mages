export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, targetX, targetY, options = {}) {
    super(scene, x, y, key);

    this.props = {
      ...{
        type: key,
        motionVector: new Phaser.Math.Vector2(targetX, targetY).subtract({x: x, y: y}).normalize(),
        owner: null
      },
      ...scene.cache.json.get('projectiles')[key],
      ...options
    };

    this.anims.play(`proj_${key}-E`, true);

    // Dynamically modify this sprite based on the type of projectile
    this.setSizeToFrame(scene.anims.anims.entries[`proj_${key}-E`].frames[0]);

    // Enable physics first to allow other transformations to apply to the physics layer
    scene.physics.world.enable(this);
    
    this.body.setCircle(this.props.collider.size);
    this.setOffset(this.props.collider.offset.x, this.props.collider.offset.y);

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
      onComplete: this.rangeReached,
      onCompleteParams: [ this ]
    });
    
  }

  rangeReached(tween, targets, projectile) {
    projectile.destroy();
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