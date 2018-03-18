import Character from './Character';

export default class SpiderMonster extends Character {
  constructor(scene, x, y,colSize=70,offsetX=84,offsetY=115) {
    super(scene, x, y, 'spider_monster',colSize,offsetX,offsetY);
    this.setAnimation('stance', 'E');
    scene.add.existing(this);
  }
}