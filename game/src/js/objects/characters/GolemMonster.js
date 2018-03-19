import Character from './Character';

export default class GolemMonster extends Character {
  constructor(scene, x, y,colSize=70,offsetX=85,offsetY=70) {
    super(scene, x, y, 'golem_monster',colSize,offsetX,offsetY);
    this.setAnimation('stance', 'E');
    scene.add.existing(this);
  }
}