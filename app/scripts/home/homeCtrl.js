'use strict';

angular.module('simapApp').controller('HomeCtrl', [
  '$scope',
  'DataService',
  'SimapModalService',
  function (
    $scope,
    DataService,
    SimapModalService
  ) {

  var refreshHomeData = function() {
    $scope.categories = [];
    $scope.items = {};
    $scope.allItems = DataService.getData().items;
    $scope.itemUnits = {};
    $scope.units = DataService.getData().units;
    $scope.plans = DataService.getData().plans;

    var categories = DataService.getData().categories;
    Object.keys(categories).forEach(function(categoryId) {
      $scope.categories.push(categories[categoryId]);
      $scope.items[categoryId] = [];
    });

    Object.keys($scope.allItems).forEach(function(itemId) {
      $scope.items[$scope.allItems[itemId].categoryId].push($scope.allItems[itemId]);

      $scope.itemUnits[itemId] = {};
      Object.keys($scope.allItems[itemId].units).forEach(function(unitId) {
        $scope.itemUnits[itemId][unitId] = $scope.units[unitId];
      });
    });
  };

  $scope.hasItems = function() {
    return !$.isEmptyObject($scope.allItems);
  };

  refreshHomeData();

  if (!$scope.hasItems()) {
    SimapModalService.showInfo({
      title: 'Welcome to Simap!',
      msg: 'Thanks for trying Simap! Here on the home screen is where you\'ll see a summary of your storage, but it looks like you don\'t have anything yet! Here\'s what you need to do in order to make the most of Simap:',
      list: [
        'Create categories on the "Categories" page.',
        'Create storage items on the "Items" page.',
        'Update your family size and storage goal on the "Planning" page.',
        'Come back to this page and enter your current inventory amounts.'
      ]
    });
  }

}]);
