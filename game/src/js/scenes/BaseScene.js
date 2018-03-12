import Grid from 'util/Grid';

export default class BaseScene extends Phaser.Scene {

  constructor(key) {
    super(key);
  }

  initGrid(opts) {
    let gridOptions = opts ? opts : {
      width: 24,
      height: 18,
      cellWidth: 32,
      cellHeight: 32,
      x: 32,
      y: 25
    };

    this.grid = new Grid(this, [], {}, gridOptions);
  }

}