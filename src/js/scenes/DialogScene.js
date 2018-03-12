import DialogModal from 'util/modals/DialogModal';

export default class DialogScene extends Phaser.Scene {

  constructor() {
    super({ key: 'DialogScene', active: true });
  }

  preload() {
    this.sampleDialog = new DialogModal(this);
    this.sampleDialog.toggleWindow();
  }

  setDialogText(text) {
    if (!this.sampleDialog.visible) this.sampleDialog.toggleWindow();
    this.sampleDialog.setText(text, true);
  }
}
