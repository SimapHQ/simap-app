'use strict';

angular.module('simapApp').controller('ItemsCtrl', function ($scope, $location) {
  $scope.helpBlock = '';
  
  $scope.items = {
    'laskdjf': 'Beans',
    'lsak3ff': 'Corn',
    'slfdk2e': 'Flour'
  };

  $scope.addNewItem = function() {
    $location.path('/item/new');
  };

  $scope.editItem = function() {
    $location.path('/item/edit/itemid');
  };

  $scope.removeItem = function() {
    
  };
});
