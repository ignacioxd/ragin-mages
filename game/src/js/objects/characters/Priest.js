import Character from './Character';

export default class Priest extends Character {
  constructor(scene, x, y,colSize,offsetX,offsetY) {
    super(scene, x, y, 'priest_hero',colSize,offsetX,offsetY);
    this.type = 'priest_hero';
    this.projectileType = 'fire';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }

}