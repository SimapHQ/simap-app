'use strict';

var app = angular.module('simapApp');

app.service('UnitService', [
  '$firebase',
  '$q',
  'CONVERSION_NODE',
  'DEFAULT_UNIT_NAME',
  'FirebaseService',
  'GuidService',
  'SessionService',
  'UNIT_NODE',
  function(
    $firebase,
    $q,
    CONVERSION_NODE,
    DEFAULT_UNIT_NAME,
    FirebaseService,
    GuidService,
    SessionService,
    UNIT_NODE
  ) {

  var firebaseRef = FirebaseService.getRef();

  this.createNew = function() {
    return this.createNewWithName(DEFAULT_UNIT_NAME);
  };

  this.createNewWithName = function(newUnitName) {
    var uid = SessionService.currentSession().uid,
        newUnitId = GuidService.generateGuid();

    var newUnitObj = FirebaseService.getObject(UNIT_NODE + newUnitId);

    return newUnitObj.$loaded().then(function() {
      newUnitObj.owner = uid;
      newUnitObj.name = newUnitName;

      return newUnitObj.$save().then(function() {
        return newUnitId;
      });
    }).finally(function() {
      newUnitObj.$destroy();
    });
  };

  this.removeOld = function(unitId) {
    return $q.all([
      $firebase(firebaseRef.child(UNIT_NODE + unitId)).$remove(),
      $firebase(firebaseRef.child(CONVERSION_NODE + unitId)).$remove()
    ]);
  };

  this.getName = function(unitId) {
    var unitObj = FirebaseService.getObject(UNIT_NODE + unitId);

    return unitObj.$loaded().then(function() {
      return unitObj.name;
    }).finally(function() {
      unitObj.$destroy();
    });
  };

}]);
