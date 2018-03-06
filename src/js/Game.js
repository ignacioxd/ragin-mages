import LoaderScene from 'scenes/LoaderScene';
import DemoScene from 'scenes/DemoScene';

class Game extends Phaser.Game {

  constructor() {
    super({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      scene: [LoaderScene, DemoScene]
    });
  }

}

new Game();
