
export const environment = {
  production: true,
  apiAddress: 'http://localhost:9595',
  serverstatAddress: 'http://play.thegatemud.it/serverstat',
  media_address: 'http://play.thegatemud.it/images/',
  socket : {
    url : 'http://play.thegatemud.it:3335',
    options : {
      'reconnection': true,
      'autoConnect:': true,
      'forceNew': true,
      'resource': 'socket.io',
      'transports': ['websocket'],
      'reconnectionDelay': 1500,
      'reconnectionDelayMax' : 5000,
      'reconnectionAttempts': 'Infinity'
    }
  },
  analytics_UAID: 'UA-122402371-1'
};
