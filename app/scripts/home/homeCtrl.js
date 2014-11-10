'use strict';

angular.module('simapApp').controller('HomeCtrl', [
  '$scope',
  'CategoriesService',
  'ConversionsService',
  'ItemsService',
  'PlansService',
  'UnitsService',
  function (
    $scope,
    CategoriesService,
    ConversionsService,
    ItemsService,
    PlansService,
    UnitsService
  ) {

  var refreshHomeData = function() {
    $scope.categories = CategoriesService.getCategories();
    $scope.items = {};
    $scope.units = UnitsService.getUnits();
    $scope.conversions = ConversionsService.getConversions();
    $scope.plans = PlansService.getPlans();

    Object.keys($scope.categories).forEach(function(categoryId) {
      $scope.items[categoryId] = {};
    });

    var items = ItemsService.getItems();
    Object.keys(items).forEach(function(itemId) {
      $scope.items[items[itemId].category_id][itemId] = items[itemId];
    });
  };

  refreshHomeData();

}]);
