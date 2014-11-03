'use strict';

var app = angular.module('simapApp');

app.controller('ItemCtrl', ['$scope', '$location', 'randomColor', function ($scope, $location, randomColor) {
  $scope.helpBlock = 'Every piece of food or household item that you store is represented as an item. You can choose which category to group an item under, define different units for each item, and specify volume requirements for adults and children.';
  $scope.infoHelpBlock = 'Each item has this basic information';
  $scope.unitsHelpBlock = 'You can create different units for each item to make tracking easy. Some examples of possible units are cups, cans, lbs or boxes. You can use anything you like.';
  $scope.planningHelpBlock = 'You can choose between two types of planning styles for each item. Rationed means you want to specify a certain amount that adults and children need each day. Simap will use this with the size of your family to determine your progress. If you select baseline, you can choose an amount that you want to maintain, regardless of your family size.';

  $scope.name = '';
  $scope.color = randomColor();

  $scope.units = {
    'l24kj3er': { name: 'cup' },
    'lkj2lkf': { name: '16oz can' },
    'l43krfef': { name: '12oz can' }
  };

  $scope.planningType = 'rationed';

  $scope.adultRationAmount = 1;
  $scope.adultRationUnit = $scope.units.l24kj3er;
  $scope.adultRationInterval = 'day';

  $scope.childRationAmount = 0.5;
  $scope.childRationUnit = $scope.units.l24kj3er;
  $scope.childRationInterval = 'day';

  $scope.baselineAmount = 12;
  $scope.baselineUnits = $scope.units.l43krfef;

  $scope.masterUnit = $scope.units.l24kj3er;

  $scope.addUnit = function() {
    var newId = 'i' + (Math.random() + 1).toString(36).substring(2, 7);
    $scope.units[newId] = { name: $scope.newUnitName };
    $scope.newUnitName = '';
  };

  $scope.editUnit = function() {

  };

  $scope.removeUnit = function(key) {
    delete $scope.units[key];
  };

  $scope.save = function() {
    $location.path('/items');
  };
}]);
