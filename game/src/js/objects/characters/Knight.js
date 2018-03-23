import Character from './Character';

export default class Knight extends Character {
  constructor(scene, x, y, opts = {
    projectileType: 'light',
    colliderSize: 70,
    colliderOffsetX: 87,
    colliderOffsetY: 80
  }) {
    super(scene, x, y, 'knight_hero', opts);
  }
}
