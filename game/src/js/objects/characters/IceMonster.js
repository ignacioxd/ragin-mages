import Character from './Character';

export default class IceMonster extends Character {
  constructor(scene, x, y,colSize=70,offsetX=88,offsetY=60) {
    super(scene, x, y, 'ice_monster',colSize,offsetX,offsetY);
    this.setAnimation('stance', 'E');
    scene.add.existing(this);
  }
}