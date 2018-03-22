export default class Button extends Phaser.GameObjects.Group {
    constructor(scene, x, y, text, defaultChecked) {

      let button = scene.add.image(300, 400, 'checkbox', defaultChecked ? 'checked' : 'unchecked').setInteractive();
      super(scene, [button]);
      this.button = button;
  

      this.button.on('pointerover', () => {

        console.log('over');
        this.button.setFrame('checked')
      });
      this.button.on('pointerout', () => {
        console.log('out');
        this.button.setFrame('unchecked')
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
        // handler(this);
 
        handler.scene.start('CharacterSelectionScene');
        
    })
   }
    
  }