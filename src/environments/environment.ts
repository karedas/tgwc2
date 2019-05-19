// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverstatAddress: 'http://play.thegatemud.it/serverstat',
  media_address: 'http://play.thegatemud.it/images/',
  socket : {
    url : 'http://51.38.185.84:3335',
    // url : 'http://play.thegatemud.it:3335',
    // url : 'http://localhost:3335',
    options : {
      'reconnection': true,
      'autoConnect:': true,
      'forceNew': true,
      'resource': 'socket.io',
      'transports': ['websocket'],
      'reconnectionDelay': 3000,
      'reconnectionDelayMax' : 5000,
      'reconnectionAttempts': 'Infinity'
    }
  },
  analytics_UAID: 'UA-122402371-2'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
