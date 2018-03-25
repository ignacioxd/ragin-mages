export default class Checkbox extends Phaser.GameObjects.Group {
  constructor(scene, x, y, text, defaultChecked) {
    const scale = 0.3;
    const fontSize = 30 //* scale;
 
    let tickbox = scene.add.image(x, y, 'checkmark', defaultChecked ? 'checked' : 'unchecked');
    tickbox.setScale(scale);
    let label = scene.add.text(x + tickbox.displayWidth - 4, y - fontSize / 1.4, text, {
      fontSize: fontSize,
      fontFamily: 'Fjalla One, sans-serif',
      fill: '#d3d3d3'
    });
    super(scene, [tickbox, label]);

    this.tickbox = tickbox;
    this.label = label;

    label.setStroke('#00000', 6);
    this.tickbox.setInteractive();
    this.checked = defaultChecked == true;

    scene.add.existing(this);

    this.tickbox.on('pointerdown', () => {
      this.toggle();
    });


  }

  isChecked() {
    return this.checked;
  }

  toggle() {
    this.setChecked(!this.checked);
  }

  setChecked(checked) {
    this.checked = checked == true;
    this.tickbox.setFrame(this.checked ? 'checked' : 'unchecked');
  }

  onPointerDown(handler) {
    this.tickbox.on('pointerdown', () => {
      handler(this);
    });
  }
}