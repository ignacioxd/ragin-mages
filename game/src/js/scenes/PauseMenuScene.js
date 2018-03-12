import MenuModal from 'util/modals/MenuModal';

export default class PauseMenuScene extends Phaser.Scene {

  constructor() {
    super({ key: 'PauseMenuScene', active: true });
  }

  preload() {
    this.menuModal = new MenuModal(this);
    this.menuModal.toggleWindow();
  }
}
