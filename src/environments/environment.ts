export const environment = {
  production: false,
  name: '',
  apiAddress: 'http://localhost:9595/api',
  serverstatAddress: 'http://play.thegatemud.it/serverstat',
  media_address: 'http://play.thegatemud.it/images/',
  analytics_UAID: 'UA-122402371-2',
  socket : {
    url : 'http://51.38.185.84:3335',
    options : {
      reconnection: true,
      autoConnect: true,
      forceNew: false,
      resource: 'socket.io',
      transports: ['websocket'],
      reconnectionDelay: 3000,
      reconnectionDelayMax : 5000,
      reconnectionAttempts: 'Infinity'
    }
  }
};
