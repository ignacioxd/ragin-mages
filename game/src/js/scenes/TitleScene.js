import ServiceWorker from 'util/ServiceWorker';
import Checkbox from 'objects/ui/Checkbox';
import Button from 'objects/ui/Button';
import DOMModal from 'objects/ui/DOMModal';

export default class TitleScene extends Phaser.Scene {

  constructor() {
    super({key: 'TitleScene'});
  }

  init() {
    this.online = navigator.onLine;
    window.addEventListener('online',  this.onlineIndicator.bind(this));
    window.addEventListener('offline', this.onlineIndicator.bind(this));
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
    this.multiPlayerButton = new Button(this, 450, 250, 'PLAY MULTI PLAYER', !this.online);
    this.multiPlayerButton.buttonDown(() => {
      this.scene.start('CharacterSelectionScene', {type: 'multi_player'});
    });
    
    //single player button
    let singlePlayerButton = new Button(this, 450, 300, 'PLAY SINGLE PLAYER');
    singlePlayerButton.buttonDown(() => {
      this.scene.start('CharacterSelectionScene', {type: 'single_player'});
    });

    //controls, credits, offline mode buttons
    let settingsButton = new Button(this, 450, 350, 'SETTINGS');
    settingsButton.buttonDown(() => {
      new DOMModal('settings', {
        cancelButtonSelector: '.exit',
        onCancel: (modal) => {
          modal.close();
        }
      });
    });
  
    let creditsButton = new Button(this, 450, 400, 'CREDITS');
    creditsButton.buttonDown(() => {

      new DOMModal('credits', {
        cancelButtonSelector: '.exit',
        onCancel: (modal) => {
          modal.close();
        }
      });

    });

    let controlsButton = new Button(this, 450, 450, 'HOW TO PLAY');
    controlsButton.buttonDown(() => {

      new DOMModal('controls', {
        cancelButtonSelector: '.exit',
        onCancel: (modal) => {
          modal.close();
        }
      });

    });
    if(ServiceWorker.isSupported()) {
      let serviceWorker = new ServiceWorker();
      let checkbox = new Checkbox(this, 470, 550, 'ENABLE OFFLINE MODE', serviceWorker.isRegistered());
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

  onlineIndicator() {
    this.online = navigator.onLine;
    this.multiPlayerButton.setDisabled(!this.online);
  }

}