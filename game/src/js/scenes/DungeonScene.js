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
    this.scaleToFit();
    //Create collision groups and event handling
    this.player_character = this.add.group();
    this.enemy_characters = this.add.group();
    this.player_projectiles = this.add.group();
    this.enemy_projectiles = this.add.group();
    this.physics.add.overlap(this.player_projectiles, this.enemy_characters, this.enemyHit, null, this);
    this.physics.add.overlap(this.enemy_projectiles, this.player_character, this.playerHit, null, this);

    this.controller = new Controller(this);
    this.scene.manager.keys.GamepadScene.start();
    this.input.keyboard.on('keydown_ESC', function () {
      if(this.currentModal) return;
      this.currentModal = new DOMModal(this, 'quitGame', {
        width: 'auto',
        acceptButtonSelector: '.exit',
        cancelButtonSelector: '#stay',
        onAccept: (modal) => {
          modal.close();
          this.music.stop();
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
    this.layer1 = this.map1.createStaticLayer('Dungeon Map', this.tileset1, -1000, -600);
    this.cameras.main.setBounds(-1000,-600,this.map1.widthInPixels, this.map1.heightInPixels);
    this.layer1.setCollisionByExclusion([5,0], true);

    this.physics.add.collider(this.player_character, this.layer1);
    this.physics.add.collider(this.enemy_characters, this.layer1);
  }

  playerHit(projectile, character) {
    this.player_projectiles.remove(projectile);
    projectile.destroy();
    if(character.hit(projectile.props.damage)) {
      this.player_character.remove(character);
      // TODO: display stats.
      new DOMModal(this, 'killed', {
        acceptButtonSelector: '#respawn',
        cancelButtonSelector: '.exit',
        onAccept: (modal) => {
          modal.close();
          this.playMusic();
          this.spawn(0, 0);
        },
        onCancel: (modal) => {
          modal.close();
          this.changeToScene('TitleScene');
        },
        data: character.stats
      });
    }
  }

  enemyHit(projectile, character) {
    this.enemy_projectiles.remove(projectile);
    projectile.destroy();
    this.localCharacter.stats.hitsInflicted++;

    if(character.hit(projectile.props.damage) && this.localCharacter) {
      this.localCharacter.stats.kills++;
      this.enemy_characters.remove(character);
    }
  }

  create() {
    this.deathSound = this.sound.add('death');
    this.music = this.sound.add('battle', { loop: true });
    this.playMusic();
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
      let monsterName = 'spider_monster';
      if (monsterDeterminer < 0.25) {
        monsterName = 'fire_monster';
      } else if (monsterDeterminer < 0.5) {
        monsterName = 'ice_monster';
      } else if (monsterDeterminer < 0.75) {
        monsterName = 'golem_monster';
      }
      if(!this.localCharacter.isDead) {
        var newMonster = new Character(this, 450 * (Math.random() - 0.5), 450 * (Math.random() - 0.5), monsterName);
        newMonster.setAI(this.localCharacter);
        this.enemyList.push(newMonster);
        this.enemy_characters.add(newMonster);
      }
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

  playMusic() {
    if (!this.registry.get('soundDisabled')) {
      this.music.play();
    }
  }

  spawn(x, y) {
    this.localCharacter = new Character(this, x, y, this.characterType);
    this.player_character.add(this.localCharacter); //this is us.
    this.cameras.main.startFollow(this.localCharacter);
  }
}
