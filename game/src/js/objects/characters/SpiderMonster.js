import Character from './Character';

export default class SpiderMonster extends Character {
  constructor(scene, x, y, opts = {
    projectileType: 'ven',
    colliderSize: 70,
    colliderOffsetX: 84,
    colliderOffsetY: 115
  }) {
    super(scene, x, y, 'spider_monster', opts);
  }
}