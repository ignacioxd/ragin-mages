export default class DOMModal {
  constructor(template, opts) {
    this.props = {
      ...{
        width: '50%',
        height: 'auto',
        gravity: DOMModal.GRAVITY_MIDDLE,
        acceptButtonSelector: null,
        cancelButtonSelector: null,
        onAccept: (modal) => {},
        onCancel: (modal) => {}
      },
      ...opts
    };

    this.createWindow();
    
    fetch(`templates/${template}.html`)
      .then(response => {
        return response.text();
      })
      .then(html => {
        this.populateWindow(html);
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Creates the dialog window
  createWindow() {
    this.root = document.createElement('div');
    this.root.className = 'modal';
    this.root.style.width = this.props.width;
    this.root.style.height = this.props.height;

    document.body.appendChild(this.root);
  }

  populateWindow(html) {
    this.root.innerHTML=html;
    this.root.querySelectorAll(this.props.acceptButtonSelector).forEach(element => {
      element.addEventListener('click', event => {
        this.props.onAccept(this);
      });
    });
    this.root.querySelectorAll(this.props.cancelButtonSelector).forEach(element => {
      element.addEventListener('click', event => {
        this.props.onCancel(this);
      });
    });
  }

  // Hide/Show the dialog window
  close() {
    document.body.removeChild(this.root);
  }
}

DOMModal.GRAVITY_MIDDLE = 0;
DOMModal.GRAVITY_TOP = 1;
DOMModal.GRAVITY_LEFT = 2;
DOMModal.GRAVITY_RIGHT = 3;
DOMModal.GRAVITY_BOTTOM = 4;