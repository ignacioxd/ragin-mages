import Character from './Character';

export default class IceMonster extends Character {
  constructor(scene, x, y, opts = {
    projectileType: 'ice',
    colliderSize: 70,
    colliderOffsetX: 88,
    colliderOffsetY: 60
  }) {
    super(scene, x, y, 'ice_monster', opts);
  }
}