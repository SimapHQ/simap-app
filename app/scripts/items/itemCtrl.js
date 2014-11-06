'use strict';

var app = angular.module('simapApp');

app.controller('ItemCtrl', [
  '$location',
  '$routeParams',
  '$scope',
  'CONVERSION_NODE',
  'FirebaseService',
  'ITEM_NODE',
  'ListService',
  'SessionService',
  'UnitService',
  function (
    $location,
    $routeParams,
    $scope,
    CONVERSION_NODE,
    FirebaseService,
    ITEM_NODE,
    ListService,
    SessionService,
    UnitService
  ) {

  var itemId = $routeParams.itemId;
  var unbindConversion;

  var refreshUnits = function() {
    $scope.units = {};
    Object.keys($scope.item.units).forEach(function(unitId) {
      UnitService.getName(unitId).then(function(unitName) {
        $scope.units[unitId] = {
          id: unitId,
          name: unitName
        };
      });
    });
  };

  FirebaseService.getObject(ITEM_NODE + itemId).$bindTo($scope, 'item').then(function() {
    refreshUnits();
    $scope.refreshConversion();
  });

  $scope.categories = ListService.getList('categories');

  $scope.addNewUnit = function() {
    UnitService.createNewWithName($scope.newUnitName).then(function(newUnitId) {
      $scope.item.units[newUnitId] = true;
      $scope.newUnitName = '';
      refreshUnits();
    });
  };

  $scope.removeUnit = function(unitId) {
    UnitService.removeOld(unitId).then(function() {
      delete $scope.item.units[unitId];
      delete $scope.conversion[unitId];
      refreshUnits();
    });
  };

  $scope.hasMultipleUnits = function() {
    if ($scope.units === undefined) {
      return false;
    }

    return Object.keys($scope.units).length > 1;
  };

  $scope.refreshConversion = function() {
    if (unbindConversion !== undefined) {
      unbindConversion();
    }

    FirebaseService.getObject(CONVERSION_NODE + $scope.item.primary_unit).$bindTo($scope, 'conversion').then(function(unbindFunction) {
      unbindConversion = unbindFunction;
      $scope.conversion.owner = SessionService.currentSession().uid;

      Object.keys($scope.conversion).forEach(function(unitId) {
        if (unitId === 'owner') {
          return;
        }

        if ($scope.item.units[unitId] !== true) {
          delete $scope.conversion[unitId];
        }
      });
    });
  };

  $scope.save = function() {
    $location.path('/items');
  };

  $scope.helpBlock = 'Every piece of food or household item that you store is represented as an item. You can choose which category to group an item under, define different units for each item, and specify volume requirements for adults and children.';
  $scope.infoHelpBlock = 'Each item has this basic information';
  $scope.unitsHelpBlock = 'You can create different units for each item to make tracking easy. Some examples of possible units are cups, cans, lbs or boxes. You can use anything you like.';
  $scope.planningHelpBlock = 'You can choose between two types of planning styles for each item. Rationed means you want to specify a certain amount that adults and children need each day. Simap will use this with the size of your family to determine your progress. If you select baseline, you can choose an amount that you want to maintain, regardless of your family size.';

}]);
