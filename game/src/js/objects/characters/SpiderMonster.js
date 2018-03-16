import Character from './Character';

export default class SpiderMonster extends Character {
  constructor(scene, x, y,colSize,offsetX,offsetY) {
    super(scene, x, y, 'spider_monster',colSize,offsetX,offsetY);
    this.type = 'spider_monster';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }



}