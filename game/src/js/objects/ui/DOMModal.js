export default class DOMModal {
  constructor(scene, template, opts) {
    this.props = {
      width: '50%',
      height: 'auto',
      gravity: DOMModal.GRAVITY_MIDDLE,
      acceptButtonSelector: null,
      cancelButtonSelector: null,
      showBackdrop: true,
      closeOnBackdropClick: false,
      onAccept: () => {},
      onCancel: () => {},
      data: null,
      ...opts
    };
    this.createWindow();

    let html = scene.cache.text.get(template);
    html ? this.populateWindow(html) : this.close();
  }

  // Creates the dialog window
  createWindow() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.style.width = this.props.width;
    this.modal.style.height = this.props.height;

    this.root = this.modal;
    if(this.props.showBackdrop) { //Add backdrop if requested
      this.root = document.createElement('div');
      this.root.className = 'backdrop';

      this.root.appendChild(this.modal);
      if(this.props.closeOnBackdropClick) {
        this.root.addEventListener('click', () => {
          this.close();
        });
      }
    }
    //Add root element to the DOM
    document.body.appendChild(this.root);
  }

  populateWindow(html) {
    this.modal.innerHTML = html;
    this.modal.querySelectorAll(this.props.acceptButtonSelector).forEach(element => {
      element.addEventListener('click', () => {
        this.props.onAccept(this);
      });
    });
    this.modal.querySelectorAll(this.props.cancelButtonSelector).forEach(element => {
      element.addEventListener('click', () => {
        this.props.onCancel(this);
      });
    });
    // Process data into HTML
    if(this.props.data) {
      const objResolve = function(rootObj, string) {
        let value = rootObj;
        let parts = string.split('.');
        while(parts.length != 0) {
          value = value[parts.shift()];
        }
        return value;
      }
      this.modal.querySelectorAll('*[data-value]').forEach(element => {
        if (element.nodeName == 'INPUT' && element.type == 'checkbox') {
          element.checked = objResolve(this.props.data, element.getAttribute('data-value'))
        }
        else if(element.nodeName == 'INPUT') {
          element.value = objResolve(this.props.data, element.getAttribute('data-value'));
        }
        else {
          element.innerHTML = objResolve(this.props.data, element.getAttribute('data-value'));
        }

      });
    }
  }

  // Hide/Show the dialog window
  close() {
    if(this.root) {
      document.body.removeChild(this.root);
      this.root = null;
    }
  }
}

DOMModal.GRAVITY_MIDDLE = 0;
DOMModal.GRAVITY_TOP = 1;
DOMModal.GRAVITY_LEFT = 2;
DOMModal.GRAVITY_RIGHT = 3;
DOMModal.GRAVITY_BOTTOM = 4;