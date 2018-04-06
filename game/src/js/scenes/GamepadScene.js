import BaseScene from '../scenes/BaseScene';

export default class GamepadScene extends BaseScene {
  constructor() {
    super({ key: 'GamepadScene' });
  }

  preload() {
    this.load.image('joystick', '/assets/sprites/joystick.png');
    this.load.image('joystick_base', '/assets/sprites/joystick_base.png');
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
    this.joystick = this.add
      .image(this.START_X, this.START_Y, 'joystick')
      .setAlpha(0.5);
    this.joystick.setInteractive();
    this.input.setDraggable(this.joystick);

    this.joystick.on('drag', (pointer, x, y) => {
      const xDist = Math.abs(this.START_X - x);
      const yDist = Math.abs(this.START_Y - y);
      this.joystick.x =
        xDist < this.MAX_DIST
          ? x
          : x > this.START_X ? this.START_X + this.MAX_DIST : this.START_X - this.MAX_DIST;
      this.joystick.y =
        yDist < this.MAX_DIST
          ? y
          : y > this.START_Y ? this.START_Y + this.MAX_DIST : this.START_Y - this.MAX_DIST;

      this.updateController(x, y);
    });

    this.joystick.on('dragend', () => {
      this.joystick.x = this.START_X;
      this.joystick.y = this.START_Y;
      this.updateController(this.START_X, this.START_Y);
    });
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
