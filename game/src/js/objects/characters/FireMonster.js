import Character from './Character';

export default class FireMonster extends Character {
  constructor(scene, x, y,colSize=70,offsetX=95,offsetY=60) {
    super(scene, x, y, 'fire_monster',colSize,offsetX,offsetY);
    this.setAnimation('stance', 'E');
    scene.add.existing(this);
  }
}