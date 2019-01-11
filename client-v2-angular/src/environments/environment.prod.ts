export const environment = {
  production: true,
  media_address: 'http://play.thegatemud.it/images/',
  socket : {
    url : 'http://51.38.185.84:3335',
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
