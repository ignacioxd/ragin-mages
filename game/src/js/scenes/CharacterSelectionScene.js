export default class CharacterSelectionScene extends Phaser.Scene {

  constructor() {
    super({key: 'CharacterSelectionScene'});
  }

  preload() {
  }
    
  create() {
    this.scene.start('GameScene');
  }

  update() {
  }
}