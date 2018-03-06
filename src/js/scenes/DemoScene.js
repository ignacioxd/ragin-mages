export default class DemoScene extends Phaser.Scene {

  constructor() {
    super({key: 'DemoScene'});
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

    let logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
  }

}