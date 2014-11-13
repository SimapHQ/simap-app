'use strict';

var app = angular.module('simapApp');

app.service('ItemService', [
  '$firebase',
  '$q',
  'CategoriesService',
  'DEFAULT_ITEM_NAME',
  'DEFAULT_UNIT_NAME',
  'FirebaseService',
  'GuidService',
  'HISTORY_NODE',
  'ITEM_NODE',
  'ItemsService',
  'PlanService',
  'randomColor',
  'SessionService',
  'UnitService',
  function(
    $firebase,
    $q,
    CategoriesService,
    DEFAULT_ITEM_NAME,
    DEFAULT_UNIT_NAME,
    FirebaseService,
    GuidService,
    HISTORY_NODE,
    ITEM_NODE,
    ItemsService,
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
          categoryId: Object.keys(CategoriesService.getCategories())[0],
          amount: 0,
          units: {},
          primaryUnitId: newUnitId,
          planId: newPlanId
        };
        newItem.units[newUnitId] = true;

        return ItemsService.addNew(newItem).then(function(newItemId) {
          return SessionService.bindToUser('items', newItemId);
        });
      });
    });
  };

  this.removeOld = function(itemId) {
    var itemObj = ItemsService.getItems()[itemId],
        removalPromises = [];

    Object.keys(itemObj.units).forEach(function(unitId) {
      removalPromises.push(UnitService.removeOld(unitId));
    });

    removalPromises.push(PlanService.removeOld(itemObj.planId));

    var historyRemovalPromise = $firebase(firebaseRef.child(HISTORY_NODE + itemId)).$remove();
    removalPromises.push(historyRemovalPromise);

    return $q.all(removalPromises).then(function() {
      return ItemsService.removeOld(itemId).then(function(removedId) {
        return SessionService.unbindFromUser('items', removedId);
      });
    });
  };

}]);
