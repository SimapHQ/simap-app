'use strict';

angular.module('simapApp').controller('InventoryCtrl', [
  '$firebase',
  '$rootScope',
  '$scope',
  'ConversionsService',
  'FirebaseService',
  'HistoryService',
  'ITEM_AMOUNT_CHANGED_EVENT',
  'ITEM_NODE',
  'UnitsService',
  function (
    $firebase,
    $rootScope,
    $scope,
    ConversionsService,
    FirebaseService,
    HistoryService,
    ITEM_AMOUNT_CHANGED_EVENT,
    ITEM_NODE,
    UnitsService
  ) {

  var firebaseRef = FirebaseService.getRef(),
      units = UnitsService.getUnits(),
      conversions = ConversionsService.getConversions();

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
    if ($scope.updateAmount === undefined || $scope.updateAmount === null) {
      $scope.updatingInventory = false;
      return;
    }

    var eventObj = {};

    var delta = $scope.updateAmount * $scope.modifier;
    eventObj.type = ITEM_AMOUNT_CHANGED_EVENT;
    eventObj.inputDelta = delta;
    eventObj.unitName = units[item.primaryUnitId].name;

    if (item.primaryUnitId !== $scope.updateUnit.$id) {
      var conversionFactor = conversions[$scope.updateUnit.$id][item.primaryUnitId];

      delta = delta * conversionFactor;

      eventObj.inputUnit = units[$scope.updateUnit.$id].name;
      eventObj.conversionFactor = conversionFactor;
      eventObj.finalDelta = delta;
    }

    $firebase(firebaseRef.child(ITEM_NODE + item.$id + '/amount')).$transaction(function(currentAmount) {
      return currentAmount + delta;
    }).then(function(updatedSnapshot) {
      eventObj.newAmount = updatedSnapshot.val();
      HistoryService.addEvent(item.$id, eventObj).then(function() {
        $rootScope.$broadcast(ITEM_AMOUNT_CHANGED_EVENT);
        $scope.updatingInventory = false;
      });
    });
  };

}]);
