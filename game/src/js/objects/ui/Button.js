export default class Button extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, options = {}) {
    super(scene, x, y, text, {
      fontSize: 30,
      fontFamily: "'Fjalla One', sans-serif",
      fill: '#d3d3d3'
    });

    this.props = {
      width: 400,
      disabled: false,
      ...options
    };

    let padding = {left: 5, right: this.props.width - this.width, top: 0, bottom: 0};

    this.setStroke('#000000', 6);
    this.setShadow(0, 0, '#000000', 4, false, false);
    this.setBackgroundColor('#ffffff00').setPadding(padding);
    this.setInteractive();

    this.setDisabled(this.props.disabled);

    this.on('pointerover', () => {
      if (!this.props.disabled) {
        this.setFill('#ffffff');
        this.setBackgroundColor('#ffffff55').setPadding(padding);
        
        this.setStroke('#00000000', 6);
        this.setShadow(0, 0, '#000000', 4, false, true);
      }
    });

    this.on('pointerout', () => {
      if (!this.props.disabled) {
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
      if (!this.props.disabled) handler(this);
    })
  }

  setDisabled(value) {
    this.props.disabled = value;
    if (this.props.disabled) this.setFill('#333333');
    else this.setFill('#d3d3d3');
  }
  
}
