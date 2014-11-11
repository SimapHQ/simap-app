'use strict';

var app = angular.module('simapApp');

app.service('ItemService', [
  '$firebase',
  '$q',
  'CategoriesService',
  'DEFAULT_ITEM_NAME',
  'DEFAULT_UNIT_NAME',
  'GuidService',
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
    GuidService,
    ITEM_NODE,
    ItemsService,
    PlanService,
    randomColor,
    SessionService,
    UnitService
  ) {

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
        unitRemovalPromises = [];

    Object.keys(itemObj.units).forEach(function(unitId) {
      unitRemovalPromises.push(UnitService.removeOld(unitId));
    });

    return $q.all(unitRemovalPromises).then(function() {
      return PlanService.removeOld(itemObj.planId).then(function() {
        return ItemsService.removeOld(itemId).then(function(removedId) {
          return SessionService.unbindFromUser('items', removedId);
        });
      });
    });
  };

}]);
