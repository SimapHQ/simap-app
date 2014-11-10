'use strict';

var app = angular.module('simapApp');

app.service('UnitsService', [
  '$firebase',
  '$q',
  'ConversionsService',
  'FirebaseService',
  'GuidService',
  'PlansService',
  'SessionService',
  'UNIT_NODE',
  function(
    $firebase,
    $q,
    ConversionsService,
    FirebaseService,
    GuidService,
    PlansService,
    SessionService,
    UNIT_NODE
  ) {

  var firebaseRef = FirebaseService.getRef(),
      units = {};

  this.getUnits = function() {
    return units;
  };

  this.refreshUnits = function(items) {
    Object.keys(units).forEach(function(unitId) {
      units[unitId].$destroy();
    });

    var unitIds = [];
    Object.keys(items).forEach(function(itemId) {
      var item = items[itemId];
      var itemUnits = item.units === undefined ? {} : item.units;
      unitIds = unitIds.concat(Object.keys(itemUnits));
    });

    var loadedPromises = [];
    units = {};
    unitIds.forEach(function(unitId) {
      units[unitId] = FirebaseService.getObject(UNIT_NODE + unitId);
      loadedPromises.push(units[unitId].$loaded());
    });

    return $q.all(loadedPromises).then(function() {
      return $q.all([
        ConversionsService.refreshConversions(units),
        PlansService.refreshPlans(items)
      ]);
    });
  };

  this.addNew = function(unitObj) {
    var newUnitId = GuidService.generateGuid();
    var newUnitObj = FirebaseService.getObject(UNIT_NODE + newUnitId);

    return newUnitObj.$loaded().then(function() {
      unitObj.owner = SessionService.uid();
      $.extend(newUnitObj, unitObj);
      return newUnitObj.$save().then(function() {
        units[newUnitId] = newUnitObj;
        return newUnitId;
      });
    });
  };

  this.removeOld = function(unitId) {
    return $firebase(firebaseRef.child(UNIT_NODE + unitId)).$remove().then(function() {
      delete units[unitId];
      return unitId;
    });
  };

}]);
