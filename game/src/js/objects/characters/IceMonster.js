import Character from './Character';

export default class IceMonster extends Character {
  constructor(scene, x, y,colSize,offsetX,offsetY) {
    super(scene, x, y, 'ice_monster',colSize,offsetX,offsetY);
    this.type = 'ice_monster';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }



}