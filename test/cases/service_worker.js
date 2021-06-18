
describe('Test service worker', function () {
    it('register service worker', function () {
      var  __waitForSWState = function(registration, desiredState) {
            return new Promise((resolve, reject) => {
              let serviceWorker = registration.installing;
          
              if (!serviceWorker) {
                return reject(new Error('The service worker is not installing. ' +
                  'Is the test environment clean?'));
              }
          
              const stateListener = (evt) => {
                if (evt.target.state === desiredState) {
                  serviceWorker.removeEventListener('statechange', stateListener);
                  return resolve();
                }
          
                if (evt.target.state === 'redundant') {
                  serviceWorker.removeEventListener('statechange', stateListener);
          
                  return reject(new Error('Installing service worker became redundant'));
                }
              };
          
              serviceWorker.addEventListener('statechange', stateListener);
            });
          }
        return navigator.serviceWorker.register("/test/static/sw.js")
            .then(function (reg ) {
                return __waitForSWState(reg,'installed');
            })

    })

    it('check if connection is created',function(){
        window.caches.match('/__test/example')
        .then((response) => {
            if (!response) {
                throw new Error('Eek, no response was found in the cache.');
            }

            return response.text();
        })
        .then((responseText) => {
            if (responseText !== 'Hello, World!') {
                throw new Error(`The response text was wrong!: '${responseText}'`);
            }
        });
    })
})