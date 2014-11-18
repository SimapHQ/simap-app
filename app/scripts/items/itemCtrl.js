'use strict';

var app = angular.module('simapApp');

app.controller('ItemCtrl', [
  '$location',
  '$q',
  '$rootScope',
  '$routeParams',
  '$scope',
  'CONVERSION_TYPE',
  'DataService',
  'DEFAULT_CONVERSION_VALUE',
  'HistoryService',
  'ITEM_PRIMARY_UNIT_CHANGED_EVENT',
  'ITEM_TYPE',
  'PLAN_TYPE',
  'SimapModalService',
  'UNIT_TYPE',
  'UnitService',
  'URIParser',
  'WaitingService',
  function (
    $location,
    $q,
    $rootScope,
    $routeParams,
    $scope,
    CONVERSION_TYPE,
    DataService,
    DEFAULT_CONVERSION_VALUE,
    HistoryService,
    ITEM_PRIMARY_UNIT_CHANGED_EVENT,
    ITEM_TYPE,
    PLAN_TYPE,
    SimapModalService,
    UNIT_TYPE,
    UnitService,
    URIParser,
    WaitingService
  ) {

  var itemId = $routeParams.itemId,
      primaryUnitChangeEvent,
      stopListeningFn;

  stopListeningFn = $rootScope.$on('$locationChangeStart', function(event, newState) {
    if (_allForms('$pristine')) {
      return;
    }

    SimapModalService.confirmNavigation().then(function(confirmed) {
      if (!confirmed) {
        return;
      }

      WaitingService.beginWaiting();
      stopListeningFn();

      var revertPromises = [
        DataService.revert(PLAN_TYPE, $scope.item.planId),
        DataService.revert(ITEM_TYPE, itemId)
      ];

      $scope.unitIds.forEach(function(unitId) {
        revertPromises.push(DataService.revert(UNIT_TYPE, unitId));
        revertPromises.push(DataService.revert(CONVERSION_TYPE, unitId));
      });

      $q.all(revertPromises).then(function() {
        $location.path(URIParser.parse(newState).pathname);
        WaitingService.doneWaiting();
      });
    });

    event.preventDefault();
  });

  var filterUnits = function() {
    var itemUnitIds = Object.keys($scope.item.units),
        itemUnits = {},
        allUnits = DataService.getData().units;

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
    $scope.conversions[$scope.item.primaryUnitId][unitId] = DEFAULT_CONVERSION_VALUE;
    $scope.updateInverse(unitId);
  };

  var _allForms = function(option) {
    return $scope.itemForm[option] &&
           $scope.primaryUnitForm[option] &&
           $scope.conversionsForm[option] &&
           $scope.planningForm[option];
  };

  var _makePristine = function() {
    $scope.itemForm.$setPristine();
    $scope.primaryUnitForm.$setPristine();
    $scope.conversionsForm.$setPristine();
    $scope.planningForm.$setPristine();
  };

  $scope.item = DataService.getData().items[itemId];
  $scope.categories = DataService.getData().categories;
  $scope.units = filterUnits();
  $scope.unitIds = Object.keys($scope.units);
  $scope.conversions = DataService.getData().conversions;
  $scope.plan = DataService.getData().plans[$scope.item.planId];

  $scope.addNewUnit = function() {
    WaitingService.beginWaiting();
    UnitService.createNewWithName($scope.newUnitName).then(function(newUnitId) {
      $scope.newUnitName = '';
      $scope.item.units[newUnitId] = true;
      refreshUnits();
      initializeConversion(newUnitId);
      $scope.item.$save().then(function() {
        WaitingService.doneWaiting();
      });
    });
  };

  $scope.removeUnit = function(unitId) {
    WaitingService.beginWaiting();
    UnitService.removeOld(unitId).then(function() {
      delete $scope.item.units[unitId];
      $scope.item.$save().then(function() {
        refreshUnits();
        WaitingService.doneWaiting();
      });
    });
  };

  $scope.hasMultipleUnits = function() {
    return $scope.units !== undefined && Object.keys($scope.units).length > 1;
  };

  $scope.updateInverse = function(unitId) {
    var invertedValue = 1 / $scope.conversions[$scope.item.primaryUnitId][unitId];

    if (!isFinite(invertedValue)) {
      return;
    }

    $scope.conversions[unitId][$scope.item.primaryUnitId] = invertedValue;
  };

  $scope.allForms = _allForms;

  $scope.save = function() {
    WaitingService.beginWaiting();

    var savePromises = [
      $scope.item.$save(),
      $scope.plan.$save()
    ];

    Object.keys($scope.item.units).forEach(function(unitId) {
      savePromises.push($scope.units[unitId].$save());
      savePromises.push($scope.conversions[unitId].$save());
    });

    if (primaryUnitChangeEvent !== undefined && primaryUnitChangeEvent !== null) {
      savePromises.push(HistoryService.addEvent($scope.item.$id, primaryUnitChangeEvent));
    }

    $q.all(savePromises).then(function() {
      primaryUnitChangeEvent = undefined;
      _makePristine();
      $location.path('/items');
      WaitingService.doneWaiting();
    });
  };

  $scope.$watch('item.primaryUnitId', function(newId, prevId) {
    if (newId === prevId || newId === undefined) {
      return;
    }

    primaryUnitChangeEvent = {
      type: ITEM_PRIMARY_UNIT_CHANGED_EVENT,
      oldAmount: $scope.item.amount,
      oldPrimaryUnitName: $scope.units[prevId].name,
      conversionFactor: $scope.conversions[prevId][newId],
      newAmount: $scope.item.amount * $scope.conversions[prevId][newId],
      newPrimaryUnitName: $scope.units[newId].name
    };

    $scope.item.amount = $scope.item.amount * $scope.conversions[prevId][newId];
  });

  $scope.helpBlock = 'Every piece of food or household item that you store is represented as an item. You can choose which category to group an item under, define different units for each item, and specify volume requirements for adults and children.';
  $scope.infoHelpBlock = 'Each item has this basic information';
  $scope.unitsHelpBlock = 'You can create different units for each item to make tracking easy. Some examples of possible units are cups, cans, lbs or boxes. You can use anything you like.';
  $scope.planningHelpBlock = 'You can choose between two types of planning styles for each item. Rationed means you want to specify a certain amount that adults and children need each day. Simap will use this with the size of your family to determine your progress. If you select baseline, you can choose an amount that you want to maintain, regardless of your family size.';

}]);
