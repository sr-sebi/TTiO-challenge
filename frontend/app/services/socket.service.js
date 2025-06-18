angular.module('myApp.core')
  .factory('SocketService', ['ENV', function(ENV) {
    let socket = null;
    const listeners = {};

    function connect() {
      if (!socket) {
        socket = io(ENV.socketURL);

        socket.on('connect', () => console.log('🔌 Socket conectado:', socket.id));
        socket.on('disconnect', () => console.log('❌ Socket desconectado'));


        socket.on('thingUpdated', (data) => {
          if (listeners['thingUpdated']) {
            listeners['thingUpdated'].forEach(cb => cb(data));
          }
        });
      }
    }

    return {
      connect,
      on: function(event, callback) {
        if (!listeners[event]) {
          listeners[event] = [];
        }
        listeners[event].push(callback);
      },
      disconnect: function() {
        if (socket) {
          socket.disconnect();
          socket = null;
        }
      }
    };
  }]);
