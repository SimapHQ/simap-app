'use strict';

angular.module('simapApp').controller('HomeCtrl', [
  '$scope',
  'CategoriesService',
  'ItemsService',
  'PlansService',
  'UnitsService',
  function (
    $scope,
    CategoriesService,
    ItemsService,
    PlansService,
    UnitsService
  ) {

  var refreshHomeData = function() {
    $scope.categories = CategoriesService.getCategories();
    $scope.items = {};
    $scope.itemUnits = {};
    $scope.units = UnitsService.getUnits();
    $scope.plans = PlansService.getPlans();

    Object.keys($scope.categories).forEach(function(categoryId) {
      $scope.items[categoryId] = {};
    });

    var items = ItemsService.getItems();
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
