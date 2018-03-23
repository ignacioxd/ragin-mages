import Character from './Character';

export default class Priest extends Character {
  constructor(scene, x, y, opts = {
    projectileType: 'orb',
    colliderSize: 70,
    colliderOffsetX: 92,
    colliderOffsetY: 80
  }) {
    super(scene, x, y, 'priest_hero', opts);
  }
}