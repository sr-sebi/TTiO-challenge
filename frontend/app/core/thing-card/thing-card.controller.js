angular.module('myApp.thingCard')
  .controller('ThingCardController', ['$location', '$scope', function($location, $scope) {
    const ctrl = this;

    // Initial
    ctrl.$onChanges = function(changes) {
      if (changes.thing && ctrl.thing) {
        ctrl.updateTelemetry();
      }
    };

    // Watch for changes in telemetry
    $scope.$watch(
      () => ctrl.thing.telemetry,
      function (newVal) {
        if (newVal && Array.isArray(newVal)) {
          ctrl.updateTelemetry();
        }
      },
      true
    );

    ctrl.updateTelemetry = function () {
      if (ctrl.thing.latestTelemetry && ctrl.thing.latestTelemetry.length > 0) {
        ctrl.latestTelemetry = ctrl.thing.latestTelemetry;
      } else {
        ctrl.latestTelemetry = [];
      }
    };

    ctrl.goToDetail = function () {
      $location.path(`/things/${ctrl.thing.id}`);
    };
  }]);
