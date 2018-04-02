export default class ServiceWorker {
  
  constructor() {
    this.refreshing = false;
  }

  register() {
    ServiceWorker.requireSWSupport();

    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => {
        if(!navigator.serviceWorker.controller) {
          return;
        }

        if(reg.waiting) {
          this.updateReady(reg.waiting);
          return;
        }

        if(reg.installing) {
          this.trackInstalling(reg.installing);
          return;
        }

        reg.addEventListener('updatefound', () => {
          this.trackInstalling(reg.installing);
        });
      });
  }

  updateReady(worker) {
    const shouldUpdate = confirm('Game update available! Reload?');
    if(shouldUpdate) {
      worker.postMessage({ action: 'skipWaiting' });
      return;
    }
  }

  trackInstalling(worker) {
    worker.addEventListener('statechange', () => {
      if(worker.state === 'installed') {
        this.updateReady(worker);
      }

      if(worker.state === 'activated') {
        if(this.refreshing) return;
        window.location.reload();
        this.refreshing = true;
      }
    });
  }

  unregister() {
    ServiceWorker.requireSWSupport();

    navigator.serviceWorker.getRegistrations().then(function(registrations) { 
      for(let registration of registrations) {
        registration.active.postMessage({ action: 'deleteCache' })
        registration.unregister();
      }
    }).catch(function() {
      console.log('Failed to delete service worker or service worker did not exist');
    });
  }

  isRegistered() {
    ServiceWorker.requireSWSupport();
    return navigator.serviceWorker.controller != null;
  }

  // STATIC METHODS

  static isSupported() {
    return 'serviceWorker' in navigator;
  }

  static requireSWSupport() {
    if(!this.isSupported()) {
      throw new Error('Service workers are not supported');
    }
  }

  static unregisterAll() {
    this.requireSWSupport();

    navigator.serviceWorker.getRegistrations().then(function(registrations) { 
      for(const registration of registrations) {
        registration.unregister();
      }
    }).catch(function() {
      console.log('Failed to delete service worker or service worker did not exist');
    });
  }
}
