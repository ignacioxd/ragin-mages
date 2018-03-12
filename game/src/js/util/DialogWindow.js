export default class DialogWindow{
  constructor(scene, opts) {
    if (!opts) opts = {};
    const {
      borderThickness = 3,
      borderColor = 0x907748,
      borderAlpha = 1,
      windowAlpha = 0.1,
      windowColor = 0xffffff,
      windowHeight = 150,
      padding = 32,
      dialogSpeed = 3,
      closeBtnColor = 'darkgoldenrod'
    } = opts;

    this.scene = scene;
    // Config for the dialog windows
    this.borderThickness = borderThickness;
    this.borderColor = borderColor;
    this.borderAlpha = borderAlpha;
    this.windowAlpha = windowAlpha;
    this.windowColor = windowColor;
    this.windowHeight = windowHeight;
    this.padding = padding;
    this.closeBtnColor = closeBtnColor;
    this.graphics;
    this.closeBtn;

    // Config for the text of the dialog window
    this.dialogSpeed = dialogSpeed;
    this.eventCounter = 0;
    this.text;
    this.dialog;

    this.visible = true;

    this._createWindow();
  }

  // Creates the dialog window
  _createWindow() {
    const gameHeight = this._getGameHeight();
    const gameWidth = this._getGameWidth();
    const windowDimensions = this._calculateWindowDimensions(gameWidth, gameHeight);

    this.graphics = this.scene.add.graphics();

    this._createOuterWindow(windowDimensions);
    this._createInnerWindow(windowDimensions);
    this._createCloseModalButtonBorder();
    this._createCloseModalButton();
  }

  // Gets the width of the game (based on the scene)
  _getGameWidth() {
    return this.scene.scene.manager.game.config.width;
  }

  // Gets the height of the game (based on the scene)
  _getGameHeight() {
    return this.scene.scene.manager.game.config.height;
  }

  // Calculates where to place the dialog window based on the game size
  _calculateWindowDimensions(width, height) {
    const x = this.padding;
    const y = height - this.windowHeight - this.padding;
    const rectWidth = width - (this.padding * 2);
    const rectHeight = this.windowHeight;
    return {
      x,
      y,
      rectWidth,
      rectHeight
    };
  }

  // Creates the inner dialog window (where the text is displayed)
  _createInnerWindow({ x, y, rectWidth, rectHeight }) {
    this.graphics.fillStyle(this.windowColor, this.windowAlpha);
    this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
  }

  // Creates the border rectangle of the dialog window
  _createOuterWindow({ x, y, rectWidth, rectHeight }) {
    this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
    this.graphics.strokeRect(x, y, rectWidth, rectHeight);
  }

  // Creates the close dialog button border
  _createCloseModalButtonBorder() {
    const x = this._getGameWidth() - this.padding - 20;
    const y = this._getGameHeight() - this.windowHeight - this.padding;
    this.graphics.strokeRect(x, y, 20, 20);
  }

  // Creates the close dialog window button
  _createCloseModalButton() {
    const self = this;
    this.closeBtn = this.scene.make.text({
      x: this._getGameWidth() - this.padding - 14,
      y: this._getGameHeight() - this.windowHeight - this.padding + 3,
      text: 'X',
      style: {
        font: 'bold 12px Arial',
        fill: this.closeBtnColor
      }
    });
    this.closeBtn.setInteractive();

    this.closeBtn.on('pointerover', function () {
      this.setTint(0xff0000);
    });
    this.closeBtn.on('pointerout', function () {
      this.clearTint();
    });
    this.closeBtn.on('pointerdown', function () {
      this.destroy();
      if (self.timedEvent) self.timedEvent.remove(false);
      if (self.text) self.text.destroy();
      self.graphics.destroy();
    });
  }

  // Slowly displays the text in the window to make it appear annimated
  _animateText() {
    this.eventCounter++;
    this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
    if (this.eventCounter === this.dialog.length) {
      this.timedEvent.remove(false);
    }
  }

  // Sets the text for the dialog window
  setText(text, animate) {
    // Reset the dialog
    this.eventCounter = 0;
    this.dialog = text.split('');
    if (this.timedEvent) this.timedEvent.remove(false);
    if (this.text) this.text.destroy();

    const x = this.padding + 10;
    const y = this._getGameHeight() - this.windowHeight - this.padding + 10;

    this.text = this.scene.make.text({
      x,
      y,
      text: animate ? '' : text,
      style: {
        wordWrap: { width: this._getGameWidth() - (this.padding * 2) - 25 }
      }
    });

    if (animate) {
      this.timedEvent = this.scene.time.addEvent({
        delay: 150 - (this.dialogSpeed * 30),
        callback: this._animateText,
        callbackScope: this,
        loop: true
      });
    }
  }

  // Hide/Show the dialog window
  toggleWindow() {
    this.visible = !this.visible;
    this.text.visible = this.visible;
    this.graphics.visible = this.visible;
    this.closeBtn.visible = this.visible;
  }
}