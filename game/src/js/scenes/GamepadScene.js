import BaseScene from '../scenes/BaseScene';

export default class GamepadScene extends BaseScene {
  constructor() {
    super({ key: 'GamepadScene' });

    this.pointerMove = this.pointerMove.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
  }

  create() {
    const { height } = this.cameras.main;
    this.MIN_DIST = 5;
    this.MAX_DIST = 40;
    this.START_X = 100;
    this.START_Y = height / 2;

    this.joystickBase = this.add
      .image(this.START_X, this.START_Y, 'joystick_base')
      .setAlpha(0.5);
    this.joystickBase.setInteractive();
    this.joystick = this.add
      .image(this.START_X, this.START_Y, 'joystick')
      .setAlpha(0.5);
    this.touchpad = this.add
      .image(this.START_X, this.START_Y, 'joystick')
      .setAlpha(0.01);
    this.touchpad.setInteractive();

    this.joystickBase.on('pointerdown', this.pointerMove);
    this.touchpad.on('pointermove', this.pointerMove);
    this.touchpad.on('pointerup', this.pointerUp);
  }

  pointerMove(pointer) {
    const { x, y } = pointer.position;
    const xDist = Math.abs(this.START_X - x);
    const yDist = Math.abs(this.START_Y - y);
    this.touchpad.x = x;
    this.touchpad.y = y;
    this.joystick.x =
      xDist < this.MAX_DIST
        ? x
        : x > this.START_X ? this.START_X + this.MAX_DIST : this.START_X - this.MAX_DIST;
    this.joystick.y =
      yDist < this.MAX_DIST
        ? y
        : y > this.START_Y ? this.START_Y + this.MAX_DIST : this.START_Y - this.MAX_DIST;

    this.updateController(x, y);
  }

  pointerUp() {
    this.joystick.x = this.START_X;
    this.joystick.y = this.START_Y;
    this.updateController(this.START_X, this.START_Y);
    this.pointer = null;
  }

  updateController(x, y) {
    const controller = this.scene.manager.keys.GameScene.controller
      || this.scene.manager.keys.DungeonScene.controller;
    const keys = {
      up: { isDown: false },
      down: { isDown: false },
      left: { isDown: false },
      right: { isDown: false }
    };

    if (x > this.START_X + this.MIN_DIST) {
      keys.right.isDown = true;
    }

    if (x < this.START_X - this.MIN_DIST) {
      keys.left.isDown = true;
    }

    if (y > this.START_Y + this.MIN_DIST) {
      keys.down.isDown = true;
    }

    if (y < this.START_Y - this.MIN_DIST) {
      keys.up.isDown = true;
    }

    if (controller) {
      controller.setVirtualKeys(keys);
    }
  }

  start() {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      this.scene.start();
    }
  }

  stop() {
    this.scene.stop();
  }
}
