'use strict';

var app = angular.module('simapApp');

app.service('ItemsService', [
  '$firebase',
  '$q',
  'FirebaseService',
  'GuidService',
  'ITEM_NODE',
  'PlansService',
  'SessionService',
  'UnitsService',
  function(
    $firebase,
    $q,
    FirebaseService,
    GuidService,
    ITEM_NODE,
    PlansService,
    SessionService,
    UnitsService
  ) {

  var firebaseRef = FirebaseService.getRef(),
      items = {};

  this.getItems = function() {
    return items;
  };

  this.refreshItems = function() {
    Object.keys(items).forEach(function(itemId) {
      items[itemId].$destroy();
    });

    var loadedPromises = [];

    items = {};
    Object.keys(SessionService.currentSession('items')).forEach(function(itemId) {
      items[itemId] = FirebaseService.getObject(ITEM_NODE + itemId);
      loadedPromises.push(items[itemId].$loaded());
    });

    return $q.all(loadedPromises).then(function() {
      return UnitsService.refreshUnits(items);
    });
  };

  this.addNew = function(itemObj) {
    var newItemId = GuidService.generateGuid();
    var newItemObj = FirebaseService.getObject(ITEM_NODE + newItemId);

    return newItemObj.$loaded().then(function() {
      itemObj.owner = SessionService.uid();
      $.extend(newItemObj, itemObj);
      return newItemObj.$save().then(function() {
        items[newItemId] = newItemObj;
        return newItemId;
      });
    });
  };

  this.removeOld = function(itemId) {
    return $firebase(firebaseRef.child(ITEM_NODE + itemId)).$remove().then(function() {
      items[itemId].$destroy();
      delete items[itemId];
      return itemId;
    });
  };

}]);
