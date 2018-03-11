import DialogWindow from 'util/DialogWindow';

export default class TestScene extends Phaser.Scene {

  constructor() {
    super({key: 'TestScene'});
  }

  preload() {
  }

  create() {
    this.sample = new DialogWindow(this);
    this.sample.setText('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit... \nLorem ipsum dolor sit amet, consectetur adipiscing elit. \n\n\n\nPress "Enter" to continue...', true);

    this.continueKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    var that = this;
    setTimeout(function(){
      that.sample.setText('testing woo');
    }, 5000);
  }

  update() {
    if(this.continueKey.isDown) {
      this.scene.start('DemoScene');
    }
  }
}
