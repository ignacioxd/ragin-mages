import Grid from 'objects/Grid';

export default class DemoScene extends Phaser.Scene {

  constructor() {
    super({key: 'GridScene'});
  }

  preload() {}

  create() {
    const gridOptions = {
      width: 24,
      height: 18,
      cellWidth: 32,
      cellHeight: 32,
      x: 32,
      y: 25
    };

    new Grid(this, [], {}, gridOptions);
  }

}