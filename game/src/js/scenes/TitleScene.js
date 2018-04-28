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

    this.scaleToFit();
  }

  create() {
    this.music = this.sound.add('title', { loop: true });
    this.playMusic();
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
      let serviceWorker = new ServiceWorker();
      let settingsButton = new Button(this, 450, 350, 'SETTINGS');

      settingsButton.buttonDown(() => {
        new DOMModal(this, 'settings', {
          cancelButtonSelector: '.exit',
          acceptButtonSelector: 'input[type=checkbox]',
          onCancel: (modal) => {
            modal.close();
          },
          onAccept: (modal) => {
            if (modal.modal.querySelector('#settingsCheck').checked) {
              serviceWorker.register().then(() => {
                serviceWorker.cacheAssets(assets);
              });
            }
            else {
              serviceWorker.unregister();
            }
            if (modal.modal.querySelector('#soundDisabled').checked) {
              this.music.stop();
              this.registry.set('soundDisabled', true);
              localStorage.setItem('soundDisabled', 'true');
            } else {
              this.registry.set('soundDisabled', false);
              localStorage.removeItem('soundDisabled');
              this.playMusic();
            }
          },
          data: {
            offlineMode: serviceWorker.isRegistered(),
            soundDisabled: !!localStorage.getItem('soundDisabled')
          }
        });
      });
    }
    let creditsButton = new Button(this, 450, 400, 'CREDITS');
    creditsButton.buttonDown(() => {
      new DOMModal(this, 'credits', {
        cancelButtonSelector: '.exit',
        closeOnBackdropClick: true,
        onCancel: (modal) => {
          modal.close();
        }
      });
    });

    let controlsButton = new Button(this, 450, 450, 'HOW TO PLAY');
    controlsButton.buttonDown(() => {
      new DOMModal(this, 'controls', {
        cancelButtonSelector: '.exit',
        closeOnBackdropClick: true,
        onCancel: (modal) => {
          modal.close();
        }
      });
    });

  }

  update() {
  }

  playMusic() {
    if (!this.registry.get('soundDisabled')) {
      this.music.play();
    }
  }

  serverConnected() {
    this.multiPlayerButton.setDisabled(false);
  }

  serverDisconnected() {
    this.multiPlayerButton.setDisabled(true);
  }
}