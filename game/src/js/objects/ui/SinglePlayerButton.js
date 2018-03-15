import Button from './Button';

export default class SinglePlayerButton extends Button {
  constructor(scene, x, y) {
    super(scene, x, y, 'single_button');

    scene.add.existing(this);
    this.setInteractive();
    

  }
  onPointerDown(handler) {
    //do stuff
    console.log('ran!');
  }

}