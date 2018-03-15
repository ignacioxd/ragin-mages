import Character from './Character';

export default class Priest extends Character {
  constructor(scene, x, y) {
    super(scene, x, y, 'knight_hero');
    this.type = 'knight_hero';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }



}