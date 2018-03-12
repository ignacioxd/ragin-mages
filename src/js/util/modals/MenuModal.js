import Modal from './Modal'

export default class MenuModal extends Modal{
  constructor(scene, opts) {
    if (!opts) opts = {};
    if (!opts.windowAlpha) opts.windowAlpha = 0.8;
    if (!opts.windowColor) opts.windowColor = 0x303030;

    super(scene, opts);

    this.setText('Menu \n\nTest');

    scene.input.keyboard.on('keydown_ESC', function () {
      this.toggleWindow();
    }, this);
  }

  _setText(text) {
    // Reset the dialog
    if (this.text) this.text.destroy();

    const x = 400;
    const y = this._getGameHeight() - this.windowHeight - this.padding + 50;

    this.text = this.scene.make.text({
      x,
      y,
      text,
      origin: { x: 0.5, y: 0.5 },
      style: {
        wordWrap: { width: this._getGameWidth() - (this.padding * 2) - 25 }
      }
    });
  }

  _createCloseModalButton() {
    return;
  }

  _createCloseModalButtonBorder() {
    return;
  }

  toggleWindow() {
    this.visible = !this.visible;
    this.text.visible = this.visible;
    this.graphics.visible = this.visible;
  }
}