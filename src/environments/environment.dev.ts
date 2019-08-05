export const environment = {
  production: false,
  name: 'development',
  apiAddress: 'http://51.38.185.84:9595/api',
  serverstatAddress: 'assets/serverstat',
  media_address: 'http://play.thegatemud.it/images/',
  analytics_UAID: 'UA-122402371-2',
  socket : {
    url : 'http://51.38.185.84:3335',
    // url : 'http://play.thegatemud.it:3335',
    options : {
      reconnection: true,
      autoConnect: true,
      forceNew: false,
      resource: 'socket.io',
      transports: ['websocket'],
      reconnectionDelay: 1500,
      reconnectionAttempts: 'Infinity'
    }
  }
};

// import 'zone.js/dist/zone-error';  // Included with Angular CLI.