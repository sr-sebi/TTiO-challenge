angular.module('myApp.thingCard')
  .component('thingCard', {
    bindings: {
      thing: '<'
    },
    controller: 'ThingCardController',
    templateUrl: 'app/core/thing-card/thing-card.html'
  });