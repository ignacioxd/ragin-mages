import BaseScene from './BaseScene';
import ServiceWorker from 'util/ServiceWorker';
import Button from 'objects/ui/Button';
import DOMModal from 'objects/ui/DOMModal';

export default class TitleScene extends BaseScene {

  constructor() {
    super({key: 'TitleScene'});
  }
  
  preload() {
    let serverConfig = this.cache.json.get('config');
    this.server.connect(serverConfig.protocol, serverConfig.host, serverConfig.port);
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
    if(ServiceWorker.isSupported()) {
      const assets = this.cache.json.get('assets');
      let offlineMode = localStorage.getItem('offlineStatus');
      offlineMode = (offlineMode == 'true')
      if (offlineMode == null) {
        offlineMode = false;
      }
      let serviceWorker = new ServiceWorker();
      let settingsButton = new Button(this, 450, 350, 'SETTINGS', serviceWorker.isRegistered());
      settingsButton.buttonDown(() => {
        new DOMModal(this, 'settings', {
          cancelButtonSelector: '.exit',
          acceptButtonSelector: '#settingsCheck',
          onCancel: (modal) => {
            localStorage.setItem('offlineStatus' , offlineMode)
            modal.close();
          },
          onAccept: (modal) => {
            offlineMode = modal.modal.querySelector('#settingsCheck').checked;        
            if (offlineMode == true) {
              serviceWorker.register().then(function() {
                serviceWorker.cacheAssets(assets);
              })
            }
            else {
              serviceWorker.unregister();
            }
          },
          data: {swCheck: offlineMode}
        });
      });
    }
  
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