import BootScene from 'scenes/BootScene';
import LoaderScene from 'scenes/LoaderScene';
import TitleScene from 'scenes/TitleScene';
import CharacterSelectionScene from 'scenes/CharacterSelectionScene';
import GameScene from 'scenes/GameScene';
import DungeonScene from 'scenes/DungeonScene';
import PauseMenuScene from 'scenes/PauseMenuScene';
import DialogScene from 'scenes/DialogScene';

class Game extends Phaser.Game {

  constructor() {
    super({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: true
        }
      },
      scene: [BootScene, LoaderScene, TitleScene, CharacterSelectionScene, GameScene, DungeonScene, PauseMenuScene, DialogScene]
    });
  }

}

new Game();
