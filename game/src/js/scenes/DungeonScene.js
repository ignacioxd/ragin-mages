import BaseScene from './BaseScene';
import Controller from '../util/Controller';
import Character from 'objects/Character';
import DOMModal from 'objects/ui/DOMModal';

export default class DungeonScene extends BaseScene {

  constructor() {
    super({ key: 'DungeonScene' });

    this.localCharacter = null;
  }

  init(data) {
    this.characterType = data.character;
  }

  preload() {

    //Create collision groups and event handling
    this.player_character = this.add.group();
    this.enemy_characters = this.add.group();
    this.player_projectiles = this.add.group();
    this.enemy_projectiles = this.add.group();
    this.physics.add.overlap(this.player_projectiles, this.enemy_characters, this.enemyHit, null, this);
    this.physics.add.overlap(this.enemy_projectiles, this.player_character, this.playerHit, null, this);

    this.controller = new Controller(this);
    this.input.keyboard.on('keydown_ESC', function () {
      if(this.currentModal) return;
      this.currentModal = new DOMModal(this, 'quitGame', {
        width: 'auto',
        acceptButtonSelector: '.exit',
        cancelButtonSelector: '#stay',
        onAccept: (modal) => {
          modal.close();
          this.currentModal = null;
          this.changeToScene('TitleScene');
        },
        onCancel: (modal) => {
          modal.close();
          this.currentModal = null;
        }
      });
    }, this);

    this.input.keyboard.on('keydown_PLUS', function () {
      this.cameras.main.setZoom(this.cameras.main.zoom + 0.1);
    }, this);

    this.input.keyboard.on('keydown_MINUS', function () {
      this.cameras.main.setZoom(this.cameras.main.zoom - 0.1);
    }, this);

    this.input.on('pointerdown', function(event) {
      if(this.localCharacter && event.buttons === 1) {
        let worldX = event.x + event.camera.scrollX * event.camera.zoom;
        let worldY = event.y + event.camera.scrollY * event.camera.zoom;
        let projectile = (this.localCharacter.fire(worldX, worldY, this.clientId));
        if (projectile) {
	  this.player_projectiles.add(projectile);
	}
      }
    }, this);

    
    this.map1 = this.add.tilemap('dungeon_map');
    this.tileset1 = this.map1.addTilesetImage('stone-tiles', 'stone-tiles');
    this.layer1 = this.map1.createStaticLayer('Dungeon Map', this.tileset1, -500, -340);

  }

  playerHit(projectile, character) {
    console.log("Player hit");
    this.player_projectiles.remove(projectile);
    projectile.destroy();
    this.player_character.remove(character);
    character.die();
    // TODO: display stats.
    new DOMModal(this, 'killed', {
      acceptButtonSelector: '#respawn',
      cancelButtonSelector: '.exit',
      onAccept: (modal) => {
        modal.close();
        this.spawn(0, 0);
      },
      onCancel: (modal) => {
        modal.close();
        this.scene.start('TitleScene');
      }
    });
  }

  enemyHit(projectile, character) {
    console.log("Enemy hit");
    this.enemy_projectiles.remove(projectile);
    projectile.destroy();
    this.enemy_characters.remove(character);
    character.die();
    /*projectile.destroy();
    character.die();
    new DOMModal('killed', {
      acceptButtonSelector: '#respawn',
      cancelButtonSelector: '.exit',
      onAccept: (modal) => {
        modal.close();
      },
      onCancel: (modal) => {
        modal.close();
        this.scene.start('TitleScene');
      }
    });*/
  }

  create() {
    this.spawn(0,0);
    this.delay = 100;
    this.enemyList = [];
    this.virtualTime = 0;
  }

  update() {
    --this.delay;
    ++this.virtualTime;
    if (this.delay <= 0) {
      const monsterDeterminer = Math.random();
    let opts;
    let monsterName;
    if (monsterDeterminer < 0.25) {
      opts = {
        projectileType: 'fire',
        colliderSize: 70,
        colliderOffsetX: 95,
        colliderOffsetY: 60
      }
      monsterName = 'fire_monster';
    } else if (monsterDeterminer < 0.5) {
      opts = {
        projectileType: 'ice',
        colliderSize: 70,
        colliderOffsetX: 88,
        colliderOffsetY: 60
      }
      monsterName = 'ice_monster';
    } else if (monsterDeterminer < 0.75) {
      opts = {
        projectileType: 'rock',
        colliderSize: 70,
        colliderOffsetX: 85,
        colliderOffsetY: 70
      }
      monsterName = 'golem_monster';
    } else {
      opts = {
        projectileType: 'ven',
        colliderSize: 70,
        colliderOffsetX: 84,
        colliderOffsetY: 115
      }
      monsterName = 'spider_monster';
    }
      var newMonster = new Character(this, 450 * (Math.random() - 0.5), 450 * (Math.random() - 0.5), monsterName, opts);
      newMonster.setAI(this.localCharacter);
      this.enemyList.push(newMonster);
      this.enemy_characters.add(newMonster);

      // Set new delay for next monster.  Starts at 1 every 250 updates but increases over time.
      this.delay = 250 - Math.sqrt(this.virtualTime/2);
    }
    
    for (let i = 0; i < this.enemyList.length; ++i) {
      this.enemyList[i].updateAI(); 
    }
    
    if(this.localCharacter) {
      const vector = this.controller.getWASDVector();
      this.localCharacter.setMotion(vector);
    }
  }

  spawn(x, y) {
    this.localCharacter = new Character(this, x, y, this.characterType);
    this.player_character.add(this.localCharacter); //this is us.
    this.cameras.main.startFollow(this.localCharacter);
  }
}
