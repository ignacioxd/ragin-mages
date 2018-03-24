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
    this.add.image(400, 430, 'sky');

    // let particles = this.add.particles('red');

    // let emitter = particles.createEmitter({
    //   speed: 100,
    //   scale: { start: 1, end: 0 },
    //   blendMode: 'ADD'
    // });
    let logoStyle = {fontSize: 85, fontFamily: "'Jim Nightshade', cursive", color: '#5E543D'};
    let logo = this.add.text(100, 100, 'Ragin\' Mages', logoStyle);
    // let logo = this.add.image(400, 100, 'logo');
    //multi player button
   
    let multi_player_button = new Button(this, 280, 300, 'multi_player');
   
    multi_player_button.buttonDown(button => 
    {
      this.scene.start('CharacterSelectionScene', {type: 'multi_player'});
    })
    
    // emitter.startFollow(logo);
    //single player button
    let single_player_button = new Button(this, 280, 350, 'single_player');
   
    single_player_button.buttonDown(button => 
    {
      this.scene.start('CharacterSelectionScene', {type: 'single_player'});
    })


    
    //controls, credits, offline mode buttons + their texts
    let controls_button = new Button(this, 280, 400, 'controls_button');

    let credits_button = new Button(this, 280, 450, 'credits_button');

  

    let serviceWorker = new ServiceWorker();
    
    let checkbox = new Checkbox(this, 105, 500, 'ENABLE OFFLINE MODE', serviceWorker.isRegistered());

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
      this.scene.start('CharacterSelectionScene');
    }
      
    if(this.startKey2.isDown) {
      this.scene.start('DungeonScene');
    }
  }

}