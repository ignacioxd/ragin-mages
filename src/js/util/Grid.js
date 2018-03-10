import GridSlot from 'objects/GridSlot';
import GridPointer from 'objects/GridPointer';

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

    const cursor = new GridPointer(scene, 10, 10);

    const numberOfTiles = opts.height * opts.width;

    for (var i = 0; i < numberOfTiles; i++) {
      const tile = new GridSlot(scene, 0, 0, 'grid_slot', cursor);
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
