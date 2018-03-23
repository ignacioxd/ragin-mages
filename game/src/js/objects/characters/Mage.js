import Character from './Character';

export default class Mage extends Character {
  constructor(scene, x, y, opts = {
    projectileType: 'orb_p',
    colliderSize: 70,
    colliderOffsetX: 92,
    colliderOffsetY: 90
  }) {
    super(scene, x, y, 'mage_hero', opts);
  }
}