import Button from './Button';

export default class MultiplayerButton extends Button {
  constructor(scene, x, y) {
    
    super(scene, x, y, 'multi_button');

    scene.add.existing(this);

  }
  onPointerDown(handler) {
    //do stuff
    console.log('ran!2');
  }

}