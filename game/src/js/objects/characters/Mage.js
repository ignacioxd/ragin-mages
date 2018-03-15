import Character from './Character';

export default class Mage extends Character {
  constructor(scene, x, y) {
    super(scene, x, y, 'mage_hero');
    this.type = 'mage_hero';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }
}