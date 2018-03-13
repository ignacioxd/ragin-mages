import Character from './Character';

export default class Priest extends Character {
  constructor(scene, x, y) {
    super(scene, x, y, 'priest_hero');
    this.type = 'priest_hero';
    this.projectileType = 'orb';
    
    this.buildAnimations(scene);

    this.setAnimation('stance', 'E');
    scene.add.existing(this);

  }

}