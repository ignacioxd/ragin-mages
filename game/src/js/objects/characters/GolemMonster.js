import Character from './Character';

export default class GolemMonster extends Character {
  constructor(scene, x, y, opts = {
    projectileType: 'rock',
    colliderSize: 70,
    colliderOffsetX: 85,
    colliderOffsetY: 70
  }) {
    super(scene, x, y, 'golem_monster', opts);
  }
}