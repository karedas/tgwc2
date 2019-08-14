export const environment = {
  production: true,
  apiAddress: 'http://http://play.thegatemud.it/api',
  serverstatAddress: 'http://play.thegatemud.it/serverstat',
  media_address: 'http://play.thegatemud.it/images/',
  analytics_UAID: 'UA-122402371-1',
  socket : {
    url : 'http://play.thegatemud.it:3335',
    options : {
      reconnection: true,
      autoConnect: true,
      forceNew: false,
      resource: 'socket.io',
      transports: ['websocket'],
      reconnectionDelay: 1500,
      reconnectionDelayMax : 5000,
      reconnectionAttempts: 'Infinity'
    }
  },
};
