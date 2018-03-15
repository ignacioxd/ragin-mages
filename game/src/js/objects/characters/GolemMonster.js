import Character from './Character';

export default class GolemMonster extends Character {
  constructor(scene, x, y) {
    super(scene, x, y, 'golem_monster');
    this.type = 'golem_monster';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }



}