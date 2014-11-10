'use strict';

var app = angular.module('simapApp');

app.service('ConversionsService', [
  '$firebase',
  '$log',
  '$q',
  'CONVERSION_NODE',
  'FirebaseService',
  'SessionService',
  function(
    $firebase,
    $log,
    $q,
    CONVERSION_NODE,
    FirebaseService,
    SessionService
  ) {

  var firebaseRef = FirebaseService.getRef(),
      conversions = {};

  this.getConversions = function() {
    return conversions;
  };

  this.refreshConversions = function(units) {
    Object.keys(conversions).forEach(function(conversionId) {
      conversions[conversionId].$destroy();
    });

    var loadedPromises = [];
    conversions = {};

    Object.keys(units).forEach(function(conversionId) {
      conversions[conversionId] = FirebaseService.getObject(CONVERSION_NODE + conversionId);
      loadedPromises.push(conversions[conversionId].$loaded());
    });

    return $q.all(loadedPromises);
  };

  this.addNew = function(unitId) {
    if (conversions[unitId] !== undefined) {
      $log.error('cannot replace conversion without cleanup! unitId: %s conversions: %s', unitId, conversions);
      return;
    }

    var newConversionObj = FirebaseService.getObject(CONVERSION_NODE + unitId);

    return newConversionObj.$loaded().then(function() {
      newConversionObj.owner = SessionService.uid();
      return newConversionObj.$save().then(function() {
        conversions[unitId] = newConversionObj;
        return unitId;
      });
    });
  };

  this.removeOld = function(unitId) {
    return $firebase(firebaseRef.child(CONVERSION_NODE + unitId)).$remove().then(function() {
      delete conversions[unitId];

      Object.keys(conversions).forEach(function(conversionId) {
        delete conversions[conversionId][unitId];
      });

      return unitId;
    });
  };

}]);
