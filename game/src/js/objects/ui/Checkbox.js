export default class Checkbox extends Phaser.GameObjects.Group {
  constructor(scene, x, y, text, defaultChecked) {
    const scale = 0.3;
    const fontSize = 66 * scale;

    let tickbox = scene.add.image(x, y, 'checkbox', defaultChecked ? 'checked' : 'unchecked');
    tickbox.setScale(scale);
    let label = scene.add.text(x + tickbox.displayWidth - 15, y - fontSize / 2, text, {
      font: `${fontSize}px Arial`,
      fill: '#ffffff'
    });
    super(scene, [tickbox, label]);

    this.tickbox = tickbox;
    this.label = label;


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