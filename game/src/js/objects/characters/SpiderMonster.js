import Character from './Character';

export default class SpiderMonster extends Character {
  constructor(scene, x, y) {
    super(scene, x, y, 'spider_monster');
    this.type = 'spider_monster';
    
    this.buildAnimations(scene);

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }



}