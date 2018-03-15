import Character from './Character';

export default class IceMonster extends Character {
  constructor(scene, x, y) {
    super(scene, x, y, 'ice_monster');
    this.type = 'ice_monster';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }



}