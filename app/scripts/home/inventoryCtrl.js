'use strict';

angular.module('simapApp').controller('InventoryCtrl', [
  '$scope',
  'ConversionsService',
  'UnitsService',
  function (
    $scope,
    ConversionsService,
    UnitsService
  ) {

  var units = UnitsService.getUnits();
  var conversions = ConversionsService.getConversions();

  $scope.updatingInventory = false;

  $scope.updateInventory = function(item, modifier) {
    $scope.modifier = modifier;
    $scope.updateAmount = 0;
    $scope.updateUnit = units[item.primaryUnitId];
    $scope.updatingInventory = true;
  };

  $scope.cancelUpdate = function() {
    $scope.updatingInventory = false;
  };

  $scope.applyUpdate = function(item) {
    var amount = $scope.updateAmount * $scope.modifier;

    if (item.primaryUnitId !== $scope.updateUnit.$id) {
      amount = amount * conversions[$scope.updateUnit.$id][item.primaryUnitId];
    }

    item.amount += amount;
    item.$save().then(function() {
      $scope.updatingInventory = false;
    });
  };

}]);
