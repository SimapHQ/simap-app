'use strict';

var app = angular.module('simapApp');

app.service('UnitService', [
  'CONVERSION_TYPE',
  'DataService',
  'DEFAULT_UNIT_NAME',
  'UNIT_TYPE',
  function(
    CONVERSION_TYPE,
    DataService,
    DEFAULT_UNIT_NAME,
    UNIT_TYPE
  ) {

  this.createNew = function() {
    return this.createNewWithName(DEFAULT_UNIT_NAME);
  };

  this.createNewWithName = function(newUnitName) {
    return DataService.addNew(UNIT_TYPE, {
      name: newUnitName
    }).then(function(newUnitId) {
      return DataService.addNew(CONVERSION_TYPE, {}, newUnitId);
    });
  };

  this.removeOld = function(unitId) {
    return DataService.removeOld(UNIT_TYPE, unitId).then(function(removedId) {
      return DataService.removeOld(CONVERSION_TYPE, removedId);
    });
  };

}]);
