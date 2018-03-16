import Character from './Character';

export default class FireMonster extends Character {
  constructor(scene, x, y,colSize,offsetX,offsetY) {
    super(scene, x, y, 'fire_monster',colSize,offsetX,offsetY);
    this.type = 'fire_monster';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }



}