import Character from './Character';

export default class Priest extends Character {
  constructor(scene, x, y,colSize,offsetX,offsetY) {
    super(scene, x, y, 'knight_hero',colSize,offsetX,offsetY);
    this.type = 'knight_hero';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }



}