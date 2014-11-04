'use strict';

var app = angular.module('simapApp');

app.service('PlanService', [
  '$firebase',
  'BASELINE_PLAN_TYPE',
  'DEFAULT_RATION_AMOUNT',
  'DEFAULT_RATION_TIME',
  'FirebaseService',
  'GuidService',
  'PLAN_NODE',
  'RATIONED_PLAN_TYPE',
  'SessionService',
  function(
    $firebase,
    BASELINE_PLAN_TYPE,
    DEFAULT_RATION_AMOUNT,
    DEFAULT_RATION_TIME,
    FirebaseService,
    GuidService,
    PLAN_NODE,
    RATIONED_PLAN_TYPE,
    SessionService
  ) {

  // var firebaseRef = FirebaseService.getRef();

  this.createRationPlan = function(unitId) {
    var uid = SessionService.currentSession().uid,
        newPlanId = GuidService.generateGuid();

    var newPlanObj = FirebaseService.getObject(PLAN_NODE + newPlanId);

    return newPlanObj.$loaded().then(function() {
      newPlanObj.owner = uid;
      newPlanObj.type = RATIONED_PLAN_TYPE;
      newPlanObj.adult = {
        amount: DEFAULT_RATION_AMOUNT,
        unit_id: unitId,
        time: DEFAULT_RATION_TIME
      };
      newPlanObj.child = {
        amount: DEFAULT_RATION_AMOUNT,
        unit_id: unitId,
        time: DEFAULT_RATION_TIME
      };

      return newPlanObj.$save().then(function() {
        return newPlanId;
      });
    }).finally(function() {
      newPlanObj.$destroy();
    });
  };

}]);
