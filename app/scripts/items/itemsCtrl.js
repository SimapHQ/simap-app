'use strict';

angular.module('simapApp').controller('ItemsCtrl', ['$scope', '$location', 'randomColor', function ($scope, $location, randomColor) {
  $scope.helpBlock = 'Here\"s your list of items.';
  
  $scope.items = {
    'i1': { name: 'Beans', color: randomColor() },
    'i2': { name: 'Corn', color: randomColor() },
    'i3': { name: 'Flour', color: randomColor() },
    'i4': { name: 'Sugar', color: randomColor() },
    'i5': { name: 'Toilet Paper', color: randomColor() },
    'i6': { name: 'Pork and Beans', color: randomColor() }
  };

  $scope.addNewItem = function() {
    $location.path('/item/edit/45');
  };

  $scope.editItem = function() {
    $location.path('/item/edit/itemid');
  };

  $scope.removeItem = function(key) {
    delete $scope.items[key];
  };
}]);
