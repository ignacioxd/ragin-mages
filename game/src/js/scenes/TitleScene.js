import ServiceWorker from 'util/ServiceWorker';
import Checkbox from 'objects/ui/Checkbox';
import SinglePlayerButton from 'objects/ui/SinglePlayerButton';
import MultiplayerButton from 'objects/ui/MultiplayerButton';

export default class TitleScene extends Phaser.Scene {

  constructor() {
    super({key: 'TitleScene'});
  }

  preload() {
  }
    
  create() {
    this.add.image(400, 300, 'sky');

    let particles = this.add.particles('red');

    let emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    let logo = this.add.image(400, 100, 'logo');

    emitter.startFollow(logo);

    this.add.text(220, 350, 'Press ENTER to begin', {
      font: '34px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: '6',
      shadowFill: '#ffffff',
      shadowStroke: '#ffffff',
      shadowOffsetY: '10',
      shadowBlur: '5'
    });

    let serviceWorker = new ServiceWorker();
    
    let checkbox = new Checkbox(this, 45, 560, 'Enable offline mode', serviceWorker.isRegistered());
    let SinglePlayerButton = new SinglePlayerButton(this, 30,560);
    let MultiplayerButton = new MultiplayerButton(this, 10,560);
    

    checkbox.onPointerDown(function(obj) {
      //TODO: add service worker
      console.log('checked', obj.isChecked() ? 'yes' : 'no');

      if(obj.isChecked()) {
        serviceWorker.register();
      }
      else {
        serviceWorker.unregister();
      }
    })  
      
    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.startKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    if(this.startKey.isDown) {
      this.scene.start('DemoScene');
    }
      
    if(this.startKey2.isDown) {
      this.scene.start('DungeonScene');
    }
  }
}