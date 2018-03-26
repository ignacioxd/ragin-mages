import ServiceWorker from 'util/ServiceWorker';
import Checkbox from 'objects/ui/Checkbox';
import Button from 'objects/ui/Button'

export default class TitleScene extends Phaser.Scene {

  constructor() {
    super({key: 'TitleScene'});
  }
  
  preload() {
  }

  create() {
    let background = this.add.image(800, 330, 'title_background');
    this.cameras.main.startFollow(background);
    
    let logoStyle = {fontSize: 85, fontFamily: "'Jim Nightshade', cursive", color: '#000000'};
    let logo = this.add.text(450, 50, 'Ragin\' Mages', logoStyle);
    logo.setStroke('#ae7f00', 16);
    
    //multi player button
    let multiPlayerButton = new Button(this, 450, 250, 'PLAY MULTI PLAYER');
    multiPlayerButton.buttonDown(() => {
      this.scene.start('CharacterSelectionScene', {type: 'multi_player'});
    });
    
    //single player button
    let singlePlayerButton = new Button(this, 450, 300, 'PLAY SINGLE PLAYER');
    singlePlayerButton.buttonDown(() => {
      this.scene.start('CharacterSelectionScene', {type: 'single_player'});
    });

    //controls, credits, offline mode buttons
    let controlsButton = new Button(this, 450, 350, 'CONTROLS');
    controlsButton.buttonDown(() => {
    });
  
    let creditsButton = new Button(this, 450, 400, 'CREDITS');
    creditsButton.buttonDown(() => {
    });

    if(ServiceWorker.isSupported()) {
      let serviceWorker = new ServiceWorker();
      let checkbox = new Checkbox(this, 470, 500, 'ENABLE OFFLINE MODE', serviceWorker.isRegistered());
      checkbox.onPointerDown(function(obj) {
        if(obj.isChecked()) {
          serviceWorker.register();
        }
        else {
          serviceWorker.unregister();
        }
      });
    }

    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.startKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    if(this.startKey.isDown) {
      this.scene.start('CharacterSelectionScene');
    }
      
    if(this.startKey2.isDown) {
      this.scene.start('DungeonScene');
    }
  }

}