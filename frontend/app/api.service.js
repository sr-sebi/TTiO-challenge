angular.module('myApp.core')
  .factory('ApiService', ['$http', function($http) {
    const baseUrl = 'http://localhost:4000/api';

    return {
      getThings: function() {
        return $http.get(`${baseUrl}/things`);
      },
      getThingById: function(id) {
        return $http.get(`${baseUrl}/things/${id}`);
      },
      getThingTelemetry: function(id) {
        return $http.get(`${baseUrl}/things/${id}/telemetry`);
      },
      updateThing: function(id, data) {
        return $http.put(`${baseUrl}/things/${id}`, data);
      },
      addTelemetryData: function(id, telemetryData) {
        return $http.post(`${baseUrl}/things/${id}/telemetry`, telemetryData);
      }
    };
  }]);
