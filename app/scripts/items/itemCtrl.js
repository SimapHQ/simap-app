'use strict';

var app = angular.module('simapApp');

app.controller('ItemCtrl', [
  '$location',
  '$q',
  '$routeParams',
  '$scope',
  'CategoriesService',
  'ConversionsService',
  'DEFAULT_CONVERSION_VALUE',
  'ItemsService',
  'PlansService',
  'UnitService',
  'UnitsService',
  function (
    $location,
    $q,
    $routeParams,
    $scope,
    CategoriesService,
    ConversionsService,
    DEFAULT_CONVERSION_VALUE,
    ItemsService,
    PlansService,
    UnitService,
    UnitsService
  ) {

  var itemId = $routeParams.itemId;

  var filterUnits = function() {
    var itemUnitIds = Object.keys($scope.item.units),
        itemUnits = {},
        allUnits = UnitsService.getUnits();

    Object.keys(allUnits).forEach(function(unitId) {
      if ($.inArray(unitId, itemUnitIds) >= 0) {
        itemUnits[unitId] = allUnits[unitId];
      }
    });

    return itemUnits;
  };

  var refreshUnits = function() {
    $scope.units = filterUnits();
  };

  var initializeConversion = function(unitId) {
    $scope.conversions[$scope.item.primary_unit][unitId] = DEFAULT_CONVERSION_VALUE;
    $scope.updateInverse(unitId);
  };


  $scope.item = ItemsService.getItems()[itemId];
  $scope.categories = CategoriesService.getCategories();
  $scope.units = filterUnits();
  $scope.unitIds = Object.keys($scope.units);
  $scope.conversions = ConversionsService.getConversions();
  $scope.plan = PlansService.getPlans()[$scope.item.plan_id];

  $scope.addNewUnit = function() {
    UnitService.createNewWithName($scope.newUnitName).then(function(newUnitId) {
      $scope.newUnitName = '';
      $scope.item.units[newUnitId] = true;
      refreshUnits();
      initializeConversion(newUnitId);
      $scope.item.$save();
    });
  };

  $scope.removeUnit = function(unitId) {
    UnitService.removeOld(unitId).then(function() {
      delete $scope.item.units[unitId];
      $scope.item.$save();
      refreshUnits();
    });
  };

  $scope.hasMultipleUnits = function() {
    return $scope.units !== undefined && Object.keys($scope.units).length > 1;
  };

  $scope.updateInverse = function(unitId) {
    var invertedValue = 1 / $scope.conversions[$scope.item.primary_unit][unitId];

    if (!isFinite(invertedValue)) {
      return;
    }

    $scope.conversions[unitId][$scope.item.primary_unit] = invertedValue;
  };

  $scope.allFormsValid = function() {
    return $scope.itemForm.$valid &&
           $scope.primaryUnitForm.$valid &&
           $scope.conversionsForm.$valid &&
           $scope.planningForm.$valid;
  };

  $scope.save = function() {
    var savePromises = [
      $scope.item.$save(),
      $scope.plan.$save()
    ];

    Object.keys($scope.item.units).forEach(function(unitId) {
      savePromises.push($scope.units[unitId].$save());
      savePromises.push($scope.conversions[unitId].$save());
    });

    $q.all(savePromises).then(function() {
      $location.path('/items');
    });
  };

  $scope.helpBlock = 'Every piece of food or household item that you store is represented as an item. You can choose which category to group an item under, define different units for each item, and specify volume requirements for adults and children.';
  $scope.infoHelpBlock = 'Each item has this basic information';
  $scope.unitsHelpBlock = 'You can create different units for each item to make tracking easy. Some examples of possible units are cups, cans, lbs or boxes. You can use anything you like.';
  $scope.planningHelpBlock = 'You can choose between two types of planning styles for each item. Rationed means you want to specify a certain amount that adults and children need each day. Simap will use this with the size of your family to determine your progress. If you select baseline, you can choose an amount that you want to maintain, regardless of your family size.';

}]);
