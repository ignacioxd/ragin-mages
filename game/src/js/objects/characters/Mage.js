import Character from './Character';

export default class Mage extends Character {
  constructor(scene, x, y,colSize,offsetX,offsetY) {
    super(scene, x, y, 'mage_hero',colSize,offsetX,offsetY);
    this.type = 'mage_hero';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }
}