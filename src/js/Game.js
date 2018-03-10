import LoaderScene from 'scenes/LoaderScene';
import TitleScene from 'scenes/TitleScene';
import DemoScene from 'scenes/DemoScene';
import DungeonScene from 'scenes/DungeonScene';

class Game extends Phaser.Game {

  constructor() {
    super({
      type: Phaser.AUTO,
      pixelArt: true,
      width: 800,
      height: 600,
      scene: [LoaderScene, TitleScene, DemoScene, DungeonScene]
    });
  }

}

new Game();
