import Character from './Character';

export default class FireMonster extends Character {
  constructor(scene, x, y, opts = {
    projectileType: 'fire',
    colliderSize: 70,
    colliderOffsetX: 95,
    colliderOffsetY: 60
  }) {
    super(scene, x, y, 'fire_monster', opts);
  }
}
