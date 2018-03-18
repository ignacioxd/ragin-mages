import Character from './Character';

export default class Priest extends Character {
  constructor(scene, x, y,colSize=70,offsetX=92,offsetY=80) {
    super(scene, x, y, 'priest_hero',colSize,offsetX,offsetY);
    this.projectileType = 'fire';

    this.setAnimation('stance', 'E');
    scene.add.existing(this);
  }
}