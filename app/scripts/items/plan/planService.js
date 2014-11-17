'use strict';

var app = angular.module('simapApp');

app.service('PlanService', [
  'DataService',
  'DEFAULT_PLAN_AMOUNT',
  'DEFAULT_PLAN_TIME',
  'PLAN_TYPE',
  'RATIONED_PLAN_TYPE',
  function(
    DataService,
    DEFAULT_PLAN_AMOUNT,
    DEFAULT_PLAN_TIME,
    PLAN_TYPE,
    RATIONED_PLAN_TYPE
  ) {

  this.createNew = function(unitId) {
    var newPlanObj = {
      type: RATIONED_PLAN_TYPE,
      adult: {
        amount: DEFAULT_PLAN_AMOUNT,
        unitId: unitId,
        time: DEFAULT_PLAN_TIME
      },
      child: {
        amount: DEFAULT_PLAN_AMOUNT,
        unitId: unitId,
        time: DEFAULT_PLAN_TIME
      },
      amount: DEFAULT_PLAN_AMOUNT,
      unitId: unitId
    };

    return DataService.addNew(PLAN_TYPE, newPlanObj);
  };

  this.removeOld = function(planId) {
    return DataService.removeOld(PLAN_TYPE, planId);
  };

}]);
