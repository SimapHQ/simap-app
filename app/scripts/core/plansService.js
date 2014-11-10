'use strict';

var app = angular.module('simapApp');

app.service('PlansService', [
  '$firebase',
  '$q',
  'PLAN_NODE',
  'FirebaseService',
  'GuidService',
  'SessionService',
  function(
    $firebase,
    $q,
    PLAN_NODE,
    FirebaseService,
    GuidService,
    SessionService
  ) {

  var firebaseRef = FirebaseService.getRef(),
      plans = {};

  this.getPlans = function() {
    return plans;
  };

  this.refreshPlans = function(items) {
    Object.keys(plans).forEach(function(planId) {
      plans[planId].$destroy();
    });

    var planIds = [];
    Object.keys(items).forEach(function(itemId) {
      planIds.push(items[itemId].plan_id);
    });

    var loadedPromises = [];
    plans = {};
    planIds.forEach(function(planId) {
      plans[planId] = FirebaseService.getObject(PLAN_NODE + planId);
      loadedPromises.push(plans[planId].$loaded());
    });

    return $q.all(loadedPromises);
  };

  this.addNew = function(planObj) {
    var newPlanId = GuidService.generateGuid();
    var newPlanObj = FirebaseService.getObject(PLAN_NODE + newPlanId);

    return newPlanObj.$loaded().then(function() {
      planObj.owner = SessionService.uid();
      $.extend(newPlanObj, planObj);
      return newPlanObj.$save().then(function() {
        plans[newPlanId] = newPlanObj;
        return newPlanId;
      });
    });
  };

  this.removeOld = function(planId) {
    return $firebase(firebaseRef.child(PLAN_NODE + planId)).$remove().then(function() {
      plans[planId].$destroy();
      delete plans[planId];
      return planId;
    });
  };

}]);
