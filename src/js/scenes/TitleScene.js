
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
    
    let sprite1 = this.add.sprite(700,500, 'toggle').setInteractive();

    sprite1.on('pointerdown', function() {
      if ('serviceWorker' in navigator) { 
        navigator.serviceWorker.getRegistrations().then(function(registrations) { 
          for(let registration of registrations) {
            registration.unregister();
          }
        }).catch(function() {
          console.log('Failed to delete service worker or service worker did not exist');
        })
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