import Projectile from 'objects/Projectile';

export default class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, handle = null, options = {}) {
    super(scene, x, y, key);
    
    //pull specific character config information from characters.json
    this.props = {
      type: key,
      motionVector: new Phaser.Math.Vector2(0, 0),
      ...scene.cache.json.get('characters')[key],
      ...options
    };
    this.props.maxHealth = this.props.health;
    
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
      highestRanking: 'Coming Soon',
      hitsReceived: 0
    };
    this.stats=stats;
    console.log(this.stats.accuracy2); // outputs function definition
    console.log(this.stats.accurracy2()) //outputs numeric value
  */
    this.stats = {
      kills: 0,
      hitsInflicted: 0,
      shots: 0,
      accuracy: 0,
      timeBorn: Date.now(),
      timeAlive: 0,
      highestRanking: null,
      hitsReceived: 0
    };

    this.lastPosition = {
      x: x,
      y: y,
      vector: this.props.motionVector,
      emittedOn: Date.now()
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

    if(handle) {
      this.handleText = scene.add.text(x, y, handle, {
        fontSize: 14,
        fill: '#ffffff',
      });
      this.handleText.setOrigin(this.props.nameText.offset.x, this.props.nameText.offset.y);
      this.handleText.setStroke('#000000', 5);
      scene.physics.world.enable(this.handleText);
    }
    this.healthBar = scene.add.graphics({x: x, y: y});
    scene.physics.world.enable(this.healthBar);
    this.drawHealth();

    scene.add.existing(this);
  }

  drawHealth() {
    if(this.props.hideHealth) return;
    const offsetX = - (this.width * this.props.scale / 2);
    const offsetY = - (this.height * this.props.scale * 4/5);
    const healthPercent = this.props.health / this.props.maxHealth;
    const padding = this.width * this.props.scale / 6;
    const width = this.width * this.props.scale - 2 * padding;
    const height = (this.height * this.props.scale) / 12;
    this.healthBar.clear();
    this.healthBar.lineStyle(1, 0xffffff, 1);
    if(healthPercent > 0.66) {
      this.healthBar.fillStyle(0x4ba303);
    }
    else if(healthPercent > 0.33) {
      this.healthBar.fillStyle(0xf49242);
    }
    else {
      this.healthBar.fillStyle(0xd31515);
    }
    this.healthBar.fillRect(offsetX + padding, offsetY, width * healthPercent, height);
    this.healthBar.strokeRect(offsetX + padding, offsetY, width, height);
  }

  setAnimation(animation, orientation, force = false) {
    if(!force && (this.isDead || this.isFiring)) return;
    orientation = orientation ? orientation : this.props.orientation;
    this.props.orientation = orientation;
    this.anims.play(`${this.props.type}-${animation}-${orientation}`, true);
  }

  /*motionChanged(vector) {
    return this.props.motionVector.x !== vector.x || this.props.motionVector.y !== vector.y;
  }*/
  
  /**
   * Moves the character in the specified direction and animates it appropriately
   * @param {Vector2} vector Specifies the direction of motion
   */
  setMotion(vector, move = true) {
    if(this.isDead || this.isFiring) return;
    this.props.motionVector = vector;
    if(move) {
      this.setGroupVelocity(vector.x * this.props.baseSpeed, vector.y * this.props.baseSpeed);
    }
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
    this.stats.shots++;
    let fireFromX = this.x + this.props.projectile.fireOffset.x * this.props.scale;
    let fireFromY = this.y + this.props.projectile.fireOffset.y * this.props.scale;
    let projectile = new Projectile(this.scene, fireFromX, fireFromY, this.props.projectile.type, targetX, targetY, {owner: this, range: this.props.projectile.baseRange});
    let fireOrientation = projectile.props.motionVector.y > 0 ? 'S' : (projectile.props.motionVector.y < 0 ? 'N' : '');
    fireOrientation += projectile.props.motionVector.x > 0  ? 'E' : (projectile.props.motionVector.x < 0  ? 'W' : '');
    this.setAnimation('fight', fireOrientation);
    this.isFiring = true;
    this.setGroupVelocity(0, 0);
    return projectile;
  }

  /**
   * Inflict damage to player. Returns true if this hit causes the player to die or false otherwise.
   * @param {Number} damage 
   */
  hit(damage) {
    this.stats.hitsReceived++;
    this.props.health -= damage;
    this.props.health = this.props.health < 0 ? 0 : this.props.health;
    this.drawHealth();

    if(this.props.health <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  die() {
    this.isDead = true;
    this.stats.accuracy = this.stats.shots > 0 ? Math.round(this.stats.hitsInflicted / this.stats.shots * 100 * 100) / 100 : 0;
    this.stats.timeAlive = Math.round((Date.now() - this.stats.timeBorn) / 1000 * 10)/10;
    this.setAnimation('death', this.props.orientation, true);
    this.setGroupVelocity(0, 0);
  }

  shouldBroadcastMotion() {
    const positionChanged = this.lastPosition.x !== this.x || this.lastPosition.y !== this.y;
    const vectorChanged = !this.props.motionVector.equals(this.lastPosition.vector);
    if((positionChanged && (Date.now() - this.lastPosition.emittedOn) >= 75) || vectorChanged) {
      this.lastPosition.x = this.x;
      this.lastPosition.y = this.y;
      this.lastPosition.vector = this.props.motionVector;
      this.lastPosition.emittedOn = Date.now();
      return true;
    }
    return false;
  }

  setGroupVelocity(x, y) {
    this.setVelocity(x, y);
    if(this.handleText && this.handleText.body) {
      this.handleText.body.setVelocity(x, y);
    }
    if(this.healthBar && this.healthBar.body) {
      this.healthBar.body.setVelocity(x, y);
    }
  }
  
  destroy() {
    super.destroy();
    if(this.handleText) {
      this.handleText.destroy();
    }
    if(this.healthBar) {
      this.healthBar.destroy();
    }
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
  
  // sets the character to use an AI, stalking and aiming at the player.
  // doesn't deal with multiple opponents yet.
  setAI(player) {
    this.AIOn = true;
    this.targetPlayer = player;

  }

  // turns off the current AI.
  turnAIOff() {
    this.AIOn = false;
    this.targetPlayer = null;
  }

  // performs one tick worth of time of what the AI is going to do.
  updateAI() {
    if (this.isDead || !this.AIOn || Math.random() < 0.8) {
      return;
    }
    const targetXPosition = this.targetPlayer.x;
    const targetYPosition = this.targetPlayer.y;
    const xDifference = this.x - targetXPosition;
    const yDifference = this.y - targetYPosition;
    const distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference);
    if (distance > 350) {
      return;
    }
    var xChange = 0;
    var yChange = 0;
    if (xDifference > 0) {
      xChange = -1;
    } else if (xDifference < 0) {
      xChange = 1;
    }
    if (yDifference > 0) {
      yChange = -1;
    } else if (yDifference < 0) {
      yChange = 1;
    }
    if (xChange != 0 || yChange != 0) {
      let vector = new Phaser.Math.Vector2(xChange, yChange).normalize();
      this.setMotion(vector);
    }

    // This is the firing part.  It has returned already if distance > 300 so it doesn't fire when far away.
    // The +35 * random part is to make it not have perfect aim.  It should aim somewhat realistically.
    const shouldFire = Math.random();
    if (shouldFire > 0.9) {
      let projectile = this.fire(targetXPosition + 35 * (Math.random() - 0.5), targetYPosition + 35 * (Math.random() - 0.5));
      if (projectile) {
        this.scene.enemy_projectiles.add(projectile);
      }
    }
  }
}
