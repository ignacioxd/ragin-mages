import Modal from './Modal'

export default class DialogModal extends Modal{
  constructor(scene, opts) {
    if (!opts) opts = {};
    const { dialogSpeed = 3 } = opts;

    if (!opts.windowHeight) opts.windowHeight = 150;
    if (!opts.padding) opts.padding = 32;
    if (!opts.windowAlpha) opts.windowAlpha = 0.8;
    if (!opts.windowColor) opts.windowColor = 0x303030;

    super(scene, opts);

    // Config for the text of the dialog window
    this.dialogSpeed = dialogSpeed;   
    this.eventCounter = 0;
    this.dialog;

    this._listenForCloseButton();
  }

  // Slowly displays the text in the window to make it appear annimated
  _animateText() {
    this.eventCounter++;
    this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
    if (this.eventCounter === this.dialog.length) {
      this.timedEvent.remove(false);
    }
  }

  // Update the close button functionality
  _listenForCloseButton() {
    const self = this;
    this.closeBtn.on('pointerdown', function () {
      if (self.timedEvent) self.timedEvent.remove(false);
      if (self.text) self.text.destroy();
    })
  }

  // Sets the text for the dialog window
  setText(text, animate) {
    // Reset the dialog
    this.eventCounter = 0;
    this.dialog = text.split('');
    if (this.timedEvent) this.timedEvent.remove(false);

    const tempText = animate ? '' : text;
    this._setText(tempText);

    if (animate) {
      this.timedEvent = this.scene.time.addEvent({
        delay: 150 - (this.dialogSpeed * 30),
        callback: this._animateText,
        callbackScope: this,
        loop: true
      });
    }
  }
}