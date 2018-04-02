import BaseScene from './BaseScene';

export default class BootScene extends BaseScene {

  constructor() {
    super({key: 'BootScene'});
  }

  preload() {
    this.load.setBaseURL('./assets/');
    this.load.json('assets');
  }

  create() {
    this.changeToScene('LoaderScene');
  }

}
