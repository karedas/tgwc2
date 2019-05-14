export const environment = {
  production: false,
  serverstatAddress: 'assets/serverstat',
  media_address: 'http://play.thegatemud.it/images/',
  socket : {
    url : 'http://localhost',
    // url : 'http://play.thegatemud.it:3335',
    options : {
      'reconnection': true,
      'autoConnect:': true,
      'forceNew': true,
      'resource': 'socket.io',
      'transports': ['websocket'],
      'reconnectionDelay': 1500,
      'reconnectionAttempts': 'Infinity'
    }
  }
};
