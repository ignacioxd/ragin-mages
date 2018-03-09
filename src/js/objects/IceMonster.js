import Character from './Character';

export default class IceMonster extends Character {
  constructor(scene, x, y) {
    super(scene, x, y, 'ice_monster');
    this.type = 'ice_monster';
    
    this.buildAnimations(scene);

    this.setAnimation('walk', 'E');
    scene.add.existing(this);

  }



}