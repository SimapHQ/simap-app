'use strict';

var app = angular.module('simapApp');

app.service('UnitService', [
  'ConversionsService',
  'DEFAULT_UNIT_NAME',
  'UnitsService',
  function(
    ConversionsService,
    DEFAULT_UNIT_NAME,
    UnitsService
  ) {

  this.createNew = function() {
    return this.createNewWithName(DEFAULT_UNIT_NAME);
  };

  this.createNewWithName = function(newUnitName) {
    return UnitsService.addNew({
      name: newUnitName
    }).then(function(newUnitId) {
      return ConversionsService.addNew(newUnitId);
    });
  };

  this.removeOld = function(unitId) {
    return UnitsService.removeOld(unitId).then(function(removedId) {
      return ConversionsService.removeOld(removedId);
    });
  };

}]);
