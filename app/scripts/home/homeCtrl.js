'use strict';

angular.module('simapApp').controller('HomeCtrl', [
  '$scope',
  'DataService',
  function (
    $scope,
    DataService
  ) {

  var refreshHomeData = function() {
    $scope.categories = DataService.getData().categories;
    $scope.items = {};
    $scope.itemUnits = {};
    $scope.units = DataService.getData().units;
    $scope.plans = DataService.getData().plans;

    Object.keys($scope.categories).forEach(function(categoryId) {
      $scope.items[categoryId] = {};
    });

    var items = DataService.getData().items;
    Object.keys(items).forEach(function(itemId) {
      $scope.items[items[itemId].categoryId][itemId] = items[itemId];

      $scope.itemUnits[itemId] = {};
      Object.keys(items[itemId].units).forEach(function(unitId) {
        $scope.itemUnits[itemId][unitId] = $scope.units[unitId];
      });
    });
  };

  refreshHomeData();

}]);
