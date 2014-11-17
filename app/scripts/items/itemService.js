'use strict';

var app = angular.module('simapApp');

app.service('ItemService', [
  '$firebase',
  '$q',
  'DataService',
  'DEFAULT_ITEM_NAME',
  'DEFAULT_UNIT_NAME',
  'FirebaseService',
  'GuidService',
  'HISTORY_NODE',
  'ITEM_NODE',
  'ITEM_TYPE',
  'PlanService',
  'randomColor',
  'SessionService',
  'UnitService',
  function(
    $firebase,
    $q,
    DataService,
    DEFAULT_ITEM_NAME,
    DEFAULT_UNIT_NAME,
    FirebaseService,
    GuidService,
    HISTORY_NODE,
    ITEM_NODE,
    ITEM_TYPE,
    PlanService,
    randomColor,
    SessionService,
    UnitService
  ) {

  var firebaseRef = FirebaseService.getRef();

  this.createNew = function() {
    return UnitService.createNew().then(function(newUnitId) {
      return PlanService.createNew(newUnitId).then(function(newPlanId) {
        var newItem = {
          name: DEFAULT_ITEM_NAME,
          color: randomColor(),
          categoryId: Object.keys(DataService.getData().categories)[0],
          amount: 0,
          units: {},
          primaryUnitId: newUnitId,
          planId: newPlanId
        };
        newItem.units[newUnitId] = true;

        return DataService.addNew(ITEM_TYPE, newItem).then(function(newItemId) {
          return SessionService.bindToUser(ITEM_TYPE, newItemId);
        });
      });
    });
  };

  this.removeOld = function(itemId) {
    var itemObj = DataService.getData().items[itemId],
        removalPromises = [];

    Object.keys(itemObj.units).forEach(function(unitId) {
      removalPromises.push(UnitService.removeOld(unitId));
    });

    removalPromises.push(PlanService.removeOld(itemObj.planId));

    var historyRemovalPromise = $firebase(firebaseRef.child(HISTORY_NODE + itemId)).$remove();
    removalPromises.push(historyRemovalPromise);

    return $q.all(removalPromises).then(function() {
      return DataService.removeOld(ITEM_TYPE, itemId).then(function(removedId) {
        return SessionService.unbindFromUser(ITEM_TYPE, removedId);
      });
    });
  };

}]);
