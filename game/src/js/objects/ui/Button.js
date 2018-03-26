export default class Button extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text) {
    super(scene, x, y, text, {
      fontSize: 30,
      fontFamily: "'Fjalla One', sans-serif",
      fill: '#d3d3d3',
      width: '500px',

    });
    let padding = {left: 5, right: 400 - this.width, top: 0, bottom: 0};
    this.setInteractive();
    this.setStroke('#000000', 6);
    this.setShadow(0, 0, '#000000', 4, false, false);
    this.setBackgroundColor('#ffffff00').setPadding(padding);

    this.on('pointerover', () => {
      this.setFill('#ffffff');
      this.setBackgroundColor('#ffffff55').setPadding(padding);
      
      this.setStroke('#00000000', 6);
      this.setShadow(0, 0, '#000000', 4, false, true);
    });

    this.on('pointerout', () => {
      this.setFill('#d3d3d3');
      this.setBackgroundColor('#ffffff00').setPadding(padding);
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
