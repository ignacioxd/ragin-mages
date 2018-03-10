import Tile from './Tile';
import Cursor from './Cursor';

export default class Grid extends Phaser.GameObjects.Group {
  /*
    opts = {
      width
      height
      cellWidth
      cellHeight
      x
      y
    }
   */
  constructor(scene, children, config, opts) {
    super(scene, children, config);

    const cursor = new Cursor(scene, 10, 10, 'cursor');

    const numberOfTiles = opts.height * opts.width;

    for (var i = 0; i < numberOfTiles; i++) {
      const tile = new Tile(scene, 0, 0, 'tile', cursor);
      this.add(tile, true);
    }

    Phaser.Actions.GridAlign(this.getChildren(), {
      width: opts.width,
      height: opts.height,
      cellWidth: opts.cellWidth,
      cellHeight: opts.cellHeight,
      x: opts.x,
      y: opts.y
    });
    console.log(scene)
    //Phaser.Utils.Align.InCenter(this);
  }
}
