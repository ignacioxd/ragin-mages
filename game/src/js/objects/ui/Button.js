export default class Button extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text) {
    super(scene, x, y, text, {
      fontSize: 30,
      fontFamily: "'Fjalla One', sans-serif",
      fill: '#d3d3d3',
      width: '500px',
      align: 'center',
      wordWrap: {width: 300, useAdvancedWrap: true}
    });
    this.setInteractive();
    this.setStroke('#000000', 6);
    this.setShadow(0, 0, '#000000', 4, false, false);
    this.setBackgroundColor('#000000');

    this.on('pointerover', () => {
      this.setFill('#ffffff');
      this.setBackgroundColor('#ffffff55').setPadding({left: 5, right: 50, top: 0, bottom: 0})
      
      this.setStroke('#00000000', 6);
      this.setShadow(0, 0, '#000000', 4, false, true);
    });

    this.on('pointerout', () => {
      this.setFill('#d3d3d3');
      this.setBackgroundColor('#ffffff00').setPadding({left: 5, right: 50, top: 0, bottom: 0});
      this.setStroke('#000000', 6);
      this.setShadow(0, 0, '#000000', 4, false, false);
    });
    
    scene.add.existing(this);
  }

  buttonDown(handler) {
    this.on('pointerdown', () => {
      handler(this);
    })
  }
  
}


// export default class Button extends Phaser.GameObjects.Group {
//     constructor(scene, x, y, text) {

//       let button = scene.add.image(x, y, text, 'norm').setInteractive();
//       super(scene, [button]);
//       this.button = button;

//       this.button.on('pointerout', () => {
//         this.button.setFrame('norm');
   
//         });

//       this.button.on('pointerover', () => {

//         this.button.setFrame('hover');
        
//       });


//     }
  
//   buttonDown(handler) {
//     this.button.on('pointerdown', () => {
//     handler(this);
//     })
//   }
    
//   }