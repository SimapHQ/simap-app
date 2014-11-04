'use strict';

var app = angular.module('simapApp');

app.service('UnitService', [
  '$firebase',
  'DEFAULT_UNIT_NAME',
  'FirebaseService',
  'GuidService',
  'SessionService',
  'UNIT_NODE',
  function(
    $firebase,
    DEFAULT_UNIT_NAME,
    FirebaseService,
    GuidService,
    SessionService,
    UNIT_NODE
  ) {

  // var firebaseRef = FirebaseService.getRef();

  this.createNew = function() {
    var uid = SessionService.currentSession().uid,
        newUnitId = GuidService.generateGuid();

    var newUnitObj = FirebaseService.getObject(UNIT_NODE + newUnitId);

    return newUnitObj.$loaded().then(function() {
      newUnitObj.owner = uid;
      newUnitObj.name = DEFAULT_UNIT_NAME;

      return newUnitObj.$save().then(function() {
        return newUnitId;
      });
    }).finally(function() {
      newUnitObj.$destroy();
    });
  };

}]);
