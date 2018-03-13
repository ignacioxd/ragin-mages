import LoaderScene from 'scenes/LoaderScene';
import TitleScene from 'scenes/TitleScene';
import DemoScene from 'scenes/DemoScene';
import DungeonScene from 'scenes/DungeonScene';
import PauseMenuScene from 'scenes/PauseMenuScene';
import DialogScene from 'scenes/DialogScene';

class Game extends Phaser.Game {

  constructor() {
    super({
      type: Phaser.AUTO,
      pixelArt: true,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: true
        }
      },
      scene: [LoaderScene, TitleScene, DemoScene, DungeonScene, PauseMenuScene, DialogScene]
    });
  }

}

new Game();
