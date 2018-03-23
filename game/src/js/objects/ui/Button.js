export default class Button extends Phaser.GameObjects.Group {
    constructor(scene, x, y, text) {

      let button = scene.add.image(x, y, text, 'norm.png').setInteractive();
      super(scene, [button]);
      this.button = button;

      this.button.on('pointerout', () => {
        this.button.setFrame('norm.png');
   
        });

      this.button.on('pointerover', () => {

        this.button.setFrame('hover.png');
        
      });


    }
  

    // isChecked() {
    //   return this.checked;

    // }
  
    // toggle() {
    //   this.setChecked(!this.checked);
    // }
  
    // setChecked(checked) {
    //   this.checked = checked == true;
    //   // this.button.setFrame(this.checked ? 'checked' : 'unchecked');
    // }
  
  buttonDown(handler) {
    this.button.on('pointerdown', () => {
    handler(this);
    })
  }
    
  }