export default class DOMModal {
  constructor(template, opts) {
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
      data: {},
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
    this.modal.innerHTML=html;
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
    this.modal.querySelectorAll('div.data').forEach(element => {
      element.innerHTML =  element.innerHTML.replace('[' + element.getAttribute('replaceField') + ']',  this.props.data[element.getAttribute('object')][element.getAttribute('property')]); 
 
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