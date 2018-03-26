import Checkbox from 'objects/ui/Checkbox';
import Button from 'objects/ui/Button'

export default class CharacterSelectionScene extends Phaser.Scene {

  constructor() {
    super({key: 'CharacterSelectionScene'});
  }
  init(data){
    this._userMode=data.type;
    console.log('user mode=' + this._userMode);
  }
  preload() {
    this.assets =  this.cache.json.get('assets');
  }
    
  create() {
    let background = this.add.image(800, 330, 'title_background');
    this.cameras.main.startFollow(background);
    
    let logoStyle = {fontSize: 85, fontFamily: "'Jim Nightshade', cursive", color: '#000000'};
    let logo = this.add.text(450, 50, 'Ragin\' Mages', logoStyle);
    logo.setStroke('#ae7f00', 16);

    this.add.text(450, 200, 'Select your character',{
      fontSize: 30,
      fontFamily: "'Fjalla One', sans-serif",
      fill: '#ae7f00',
      width: '500px',
    });

    let btnX=450;
    let btnY=250;
    let btnSpacing=50;
    for(let character of this.assets.characters) {
      this._addCharacterButton(character,this,btnX,btnY );
      btnY +=btnSpacing;
    }
  }

  _addCharacterButton(btnData,scene,x,y){
    let chkButton = new Button(this, x, y, btnData.label);
    chkButton.key=btnData.key;
    chkButton.scene=scene;
    chkButton.buttonDown(() => {
      if (this._userMode=='multi_player') {
        // console.log('starting multi-player for mode ' + this._userMode);
        this.scene.start('GameScene',{character: btnData.key});  
      }
      else {
        // console.log('starting single-player for mode ' + this._userMode);
        this.scene.start('DungeonScene',{character: btnData.key});
      }
    });
  }

  update() {

  }

}