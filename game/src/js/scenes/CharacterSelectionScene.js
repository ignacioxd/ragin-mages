import BaseScene from './BaseScene';
import Button from 'objects/ui/Button';
import DOMModal from 'objects/ui/DOMModal';
import Controller from '../util/Controller';
import Character from 'objects/Character';

export default class CharacterSelectionScene extends BaseScene {
  constructor() {
    super({key: 'CharacterSelectionScene'});
  }

  init(data){
    this.gameType = data.type;
  }

  preload() {
    this.controller = new Controller(this);
  }
    
  create() {
    let background = this.add.image(800, 330, 'title_background');
    this.cameras.main.startFollow(background);
    
    let logoStyle = {fontSize: 85, fontFamily: "'Jim Nightshade', cursive", color: '#000000'};
    let logo = this.add.text(450, 50, 'Ragin\' Mages', logoStyle);
    logo.setStroke('#ae7f00', 16);
    let playerMode= this.gameType == 'single_player' ? 'single player mode' : 'multiplayer on-line battle mode';
    
    this.add.text(450, 200, `Select your character for ${playerMode}`, {
      fontSize: 30,
      fontFamily: "'Fjalla One', sans-serif",
      fill: '#ae7f00',
      width: '500px',
    });


    this.characterBackdrop = this.add.graphics();
    this.characterBackdrop.x = 755;
    this.characterBackdrop.y = 270;
    this.characterBackdrop.fillStyle(0xffffff, 0.5);
    this.characterBackdrop.fillRect(0, 0, 300, 300);

    let btnX=450;
    let btnY=250;
    let btnSpacing=50;

    let characterList = this.cache.json.get('characters');
    for (const key in characterList) {
      this.addCharacterButton(characterList[key], this, btnX, btnY);
      btnY +=btnSpacing;
    }

    if(this.gameType == 'multi_player') {
      this.playerHandle = this.add.text(905, this.characterBackdrop.y + 300 + 10, 'No name', {
        fontSize: 28,
        fontFamily: "'Fjalla One', sans-serif",
        fill: '#ae7f00',
      });
      this.playerHandle.setOrigin(0.5, 0);

      let nameInputButton = new Button(this, 905, this.characterBackdrop.y + 300 + 55, 'Select Name', {width: 150});
      nameInputButton.setOrigin(0.5, 0);
      nameInputButton.buttonDown(() => {
        
        new DOMModal(this, 'nameSelection', {
          width: 'auto',
          cancelButtonSelector: '#cancel',
          acceptButtonSelector: '#accept',
          onCancel: (modal) => {
            modal.close();
            console.log("onCancel");
          },
          onAccept: (modal) => {
            console.log("onAccept");
            modal.modal.querySelectorAll('input').forEach(element => {
              this.playerHandle.setText(element.value);
            });
            modal.close();
          }
        });
      });
    }
  }

  addCharacterButton(btnData, scene, x, y){
    let chkButton = new Button(this, x, y, btnData.name, {width: 250});
    chkButton.key=btnData.key;
    chkButton.scene=scene;
    chkButton.buttonDown(() => {
      this.changeToScene(this.gameType == 'multi_player' ? 'GameScene' : 'DungeonScene', {character: btnData.key, playerHandle: this.playerHandle.text});  
    });

    chkButton.on('pointerover', () => {
      this.showCharacter(btnData.key);
    });
    
    let backToMenuButton = new Button(this, 450, 625, 'BACK', {
      width: 250,
      fontColorNormal: '#ffffff'
    });
    backToMenuButton.buttonDown(() => {
      this.changeToScene('TitleScene');
    });


  }

  showCharacter(key) {
    if(this.chosenCharacter) this.chosenCharacter.destroy();
    this.chosenCharacter = new Character(this, this.characterBackdrop.x + 150, this.characterBackdrop.y + 300 * 0.8, key, null, {
      scale: 1,
      orientation: 'S',
    });
  }

  update() {
    if(this.chosenCharacter) {
      const orientation = this.controller.getWASDCoordinate();
      this.chosenCharacter.setAnimation(orientation != '' ? 'walk' : 'stance', orientation);
    }
  }

}