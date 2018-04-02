import BaseScene from './BaseScene';
import ServiceWorker from 'util/ServiceWorker';
import Checkbox from 'objects/ui/Checkbox';
import Button from 'objects/ui/Button';
import DOMModal from 'objects/ui/DOMModal';

export default class TitleScene extends BaseScene {

  constructor() {
    super({key: 'TitleScene'});
  }
  
  preload() {
    let serverConfig = this.cache.json.get('config');
    this.server.connect(serverConfig.protocol, serverConfig.host, serverConfig.ioport);
    this.server.requestEvents();
    this.server.on('serverConnected', this.serverConnected, this);
    this.server.on('serverDisconnected', this.serverDisconnected, this);
  }

  create() {
    let background = this.add.image(800, 330, 'title_background');
    this.cameras.main.startFollow(background);
    
    let logoStyle = {fontSize: 85, fontFamily: "'Jim Nightshade', cursive", color: '#000000'};
    let logo = this.add.text(450, 50, 'Ragin\' Mages', logoStyle);
    logo.setStroke('#ae7f00', 16);
    
    //multi player button
    this.multiPlayerButton = new Button(this, 450, 250, 'PLAY MULTI PLAYER', {
      disabled: !this.server.isConnected()
    });
    this.multiPlayerButton.buttonDown(() => {
      this.changeToScene('CharacterSelectionScene', {type: 'multi_player'});
    });
    
    //single player button
    let singlePlayerButton = new Button(this, 450, 300, 'PLAY SINGLE PLAYER');
    singlePlayerButton.buttonDown(() => {
      this.changeToScene('CharacterSelectionScene', {type: 'single_player'});
    });

    //controls, credits, offline mode buttons
    let settingsButton = new Button(this, 450, 350, 'SETTINGS');
    settingsButton.buttonDown(() => {
      new DOMModal(this, 'settings', {
        cancelButtonSelector: '.exit',
        onCancel: (modal) => {
          modal.close();
        }
      });
    });
  
    let creditsButton = new Button(this, 450, 400, 'CREDITS');
    creditsButton.buttonDown(() => {
      new DOMModal(this, 'credits', {
        cancelButtonSelector: '.exit',
        onCancel: (modal) => {
          modal.close();
        }
      });
    });

    let controlsButton = new Button(this, 450, 450, 'HOW TO PLAY');
    controlsButton.buttonDown(() => {
      new DOMModal(this, 'controls', {
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
  }

  update() {
  }

  serverConnected() {
    this.multiPlayerButton.setDisabled(false);
  }

  serverDisconnected() {
    this.multiPlayerButton.setDisabled(true);
  }
}