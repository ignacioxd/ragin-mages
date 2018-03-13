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
      scene: [LoaderScene, TitleScene, DemoScene, DungeonScene, PauseMenuScene, DialogScene],
      physics: {
        default: 'impact',
        impact: {
            gravity: 0,
            debug: false
        }
      }  
    });
  }

}

new Game();
