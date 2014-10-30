'use strict';

var app = angular.module('simapApp');

app.service('GoalService', [
  '$firebase',
  '$log',
  '$q',
  'DEFAULT_GOAL_DAYS',
  'DEFAULT_GOAL_MONTHS',
  'FirebaseService',
  'GOAL_NODE',
  'GuidService',
  'USER_NODE',
  function(
    $firebase,
    $log,
    $q,
    DEFAULT_GOAL_DAYS,
    DEFAULT_GOAL_MONTHS,
    FirebaseService,
    GOAL_NODE,
    GuidService,
    USER_NODE
  ) {
  var firebaseRef = FirebaseService.getRef();

  this.updateUser = function(uid) {
    var syncedUser = $firebase(firebaseRef.child(USER_NODE + uid)).$asObject();
    return syncedUser.$loaded().then(function() {
      if (syncedUser.goal_id === undefined || syncedUser.goal_id === null) {
        return _createNewGoal(syncedUser);
      } else {
        return _updateExistingGoal(syncedUser);
      }
    }).finally(function() {
      syncedUser.$destroy();
    });
  };

  var _createNewGoal = function(syncedUser) {
    var newGoalId = GuidService.generateGuid();
    var syncedGoal = $firebase(firebaseRef.child(GOAL_NODE + newGoalId)).$asObject();

    return syncedGoal.$loaded().then(function() {
      syncedGoal.owner = syncedUser.uid;
      syncedGoal.months = DEFAULT_GOAL_MONTHS;
      syncedGoal.days = DEFAULT_GOAL_DAYS;

      return syncedGoal.$save().then(function() {
        syncedUser.goal_id = newGoalId;
        return syncedUser.$save();
      });
    }).finally(function() {
      syncedGoal.$destroy();
    });
  };

  var _updateExistingGoal = function(syncedUser) {
    var syncedGoal = $firebase(firebaseRef.child(GOAL_NODE + syncedUser.goal_id)).$asObject();

    return syncedGoal.$loaded().then(function() {
      // Update goal schema as necessary
      return syncedGoal.$save();
    }).finally(function() {
      syncedGoal.$destroy();
    });
  };
}]);
