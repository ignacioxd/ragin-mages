export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, targetX, targetY) {
    super(scene, x, y, key);
    this.anims.play(`proj_${key}-E`, true);

    // Dynamically modify this sprite based on the type of projectile
    this.setSizeToFrame(scene.anims.anims.entries[`proj_${key}-E`].frames[0]);

    // Enable physics first to allow other transformations to apply to the physics layer
    scene.physics.world.enable(this);
    // Set the size of the collider based on the type of projectile
    this.setColliderSize(key);

    this.type = key;
    this.speed = 250;

    this.vector = new Phaser.Math.Vector2(targetX, targetY).subtract({x: x, y: y}).normalize();
    this.setRotation(this.vector.angle());
    this.setVelocity(this.vector.x * this.speed, this.vector.y * this.speed);

    this.setScale(.4);

    scene.add.existing(this);
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