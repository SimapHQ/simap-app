'use strict';

var app = angular.module('simapApp');

app.service('PlanService', [
  'DEFAULT_PLAN_AMOUNT',
  'DEFAULT_PLAN_TIME',
  'PlansService',
  'RATIONED_PLAN_TYPE',
  function(
    DEFAULT_PLAN_AMOUNT,
    DEFAULT_PLAN_TIME,
    PlansService,
    RATIONED_PLAN_TYPE
  ) {

  this.createNew = function(unitId) {
    var newPlanObj = {
      type: RATIONED_PLAN_TYPE,
      adult: {
        amount: DEFAULT_PLAN_AMOUNT,
        unit_id: unitId,
        time: DEFAULT_PLAN_TIME
      },
      child: {
        amount: DEFAULT_PLAN_AMOUNT,
        unit_id: unitId,
        time: DEFAULT_PLAN_TIME
      },
      amount: DEFAULT_PLAN_AMOUNT,
      unit_id: unitId
    };

    return PlansService.addNew(newPlanObj);
  };

  this.removeOld = function(planId) {
    return PlansService.removeOld(planId);
  };

}]);
