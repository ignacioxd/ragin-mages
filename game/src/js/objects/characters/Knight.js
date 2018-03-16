import Character from './Character';

export default class Priest extends Character {
  constructor(scene, x, y,colSize=70,offsetX=87,offsetY=80) {
    super(scene, x, y, 'knight_hero',colSize,offsetX,offsetY);
    this.type = 'knight_hero';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }



}