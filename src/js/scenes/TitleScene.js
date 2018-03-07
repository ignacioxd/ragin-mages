
export default class TitleScene extends Phaser.Scene {

  constructor() {
    super({key: 'TitleScene'});
  }

  preload() {
  }

  create() {
    this.add.image(400, 300, 'sky');

    let particles = this.add.particles('red');

    let emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    let logo = this.add.image(400, 100, 'logo');

    emitter.startFollow(logo);

    this.add.text(230, 350, 'Press ENTER to begin', {
      font: '34px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: '6',
      shadowFill: '#ffffff',
      shadowStroke: '#ffffff',
      shadowOffsetY: '10',
      shadowBlur: '5'
    });


    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    if(this.startKey.isDown) {
      this.scene.start('DemoScene');
    }
  }
}