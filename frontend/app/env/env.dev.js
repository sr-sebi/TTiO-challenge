angular.module('myApp.config', [])
  .constant('ENV', {
    apiUrl: 'http://localhost:4000/api',
    socketURL: 'http://localhost:4000'
  });