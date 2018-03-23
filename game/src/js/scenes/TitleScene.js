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

    let logo = this.add.image(400, 100, 'logo');
    //multi player button
   
    let multi_player_button = new Button(this, 280, 200, 'multi_player');
   
    multi_player_button.buttonDown(button => 
    {
      this.scene.start('CharacterSelectionScene', {type: 'multi_player'});
    })

    // emitter.startFollow(logo);
    //single player button
    let single_player_button = new Button(this, 280, 320, 'single_player');
   
    single_player_button.buttonDown(button => 
    {
      this.scene.start('CharacterSelectionScene', {type: 'single_player'});
    })

    const text_style = {font: "bold 18px Arial", fill: "#fff", boundsAlignH: "center", backgroundColor: 'rgba(0,0,0)', boundsAlignV: "middle"};
    
    //controls, credits, offline mode buttons + their texts
    let controls_button = new Button(this, 150, 433, 'controls_button');
    let controls = this.add.text(108, 490, 'controls', text_style);
    let credits_button = new Button(this, 275, 433, 'credits_button');
    let credits = this.add.text(235, 490, 'credits', text_style);
    let SW = this.add.text(355, 490, 'enable offline mode', text_style)
  

    let serviceWorker = new ServiceWorker();
    
    let checkbox = new Checkbox(this, 400, 433, serviceWorker.isRegistered());

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