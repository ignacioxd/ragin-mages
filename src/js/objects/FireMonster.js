import Character from './Character';

export default class FireMonster extends Character {
  constructor(scene, x, y) {
    super(scene, x, y, 'fire_monster');
    this.type = 'fire_monster';
    
    this.buildAnimations(scene);

    this.setAnimation('fight', 'E');
    scene.add.existing(this);

  }



}