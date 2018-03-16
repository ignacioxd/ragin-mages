import Character from './Character';

export default class GolemMonster extends Character {
  constructor(scene, x, y,colSize,offsetX,offsetY) {
    super(scene, x, y, 'golem_monster',colSize,offsetX,offsetY);
    this.type = 'golem_monster';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }



}