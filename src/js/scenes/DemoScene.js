import Character from 'objects/Character';

export default class DemoScene extends Phaser.Scene {

  constructor() {
    super({key: 'DemoScene'});
  }

  preload() {
  }

  create() {
    

    let char = new Character(this, 0,  0, 'soldier');
    this.cameras.main.startFollow(char);
  }

}