export default class Button extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, disabled = false) {
    super(scene, x, y, text, {
      fontSize: 30,
      fontFamily: "'Fjalla One', sans-serif",
      fill: '#d3d3d3',
      width: '500px',

    });
    let padding = {left: 5, right: 400 - this.width, top: 0, bottom: 0};
    this.disabled = disabled;

    this.setStroke('#000000', 6);
    this.setShadow(0, 0, '#000000', 4, false, false);
    this.setBackgroundColor('#ffffff00').setPadding(padding);
    this.setInteractive();

    if (this.disabled) this.setFill('#333333');

    this.on('pointerover', () => {
      if (!this.disabled) {
        this.setFill('#ffffff');
        this.setBackgroundColor('#ffffff55').setPadding(padding);
        
        this.setStroke('#00000000', 6);
        this.setShadow(0, 0, '#000000', 4, false, true);
      }
    });

    this.on('pointerout', () => {
      if (!this.disabled) {
        this.setFill('#d3d3d3');
        this.setBackgroundColor('#ffffff00').setPadding(padding);
        this.setStroke('#000000', 6);
        this.setShadow(0, 0, '#000000', 4, false, false);
      }
    });
    
    scene.add.existing(this);
  }

  buttonDown(handler) {
    this.on('pointerdown', () => {
      if (!this.disabled) handler(this);
    })
  }

  setDisabled(value) {
    this.disabled = value;
    if (this.disabled) this.setFill('#333333');
    else this.setFill('#d3d3d3');
  }
  
}
