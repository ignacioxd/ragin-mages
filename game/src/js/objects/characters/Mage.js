import Character from './Character';

export default class Mage extends Character {
  constructor(scene, x, y,colSize=70,offsetX=92,offsetY=90) {
    super(scene, x, y, 'mage_hero',colSize,offsetX,offsetY);
    this.type = 'mage_hero';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }
}