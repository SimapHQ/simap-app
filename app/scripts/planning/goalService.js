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
  'SessionService',
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
    SessionService,
    USER_NODE
  ) {

  var syncedGoal;

  this.updateUsersGoal = function(uid) {
    var syncedUser = FirebaseService.getObject(USER_NODE + uid);
    return syncedUser.$loaded().then(function() {
      if (syncedUser.goalId === undefined || syncedUser.goalId === null) {
        return _createNewGoal(syncedUser);
      } else {
        return _updateExistingGoal(syncedUser);
      }
    }).finally(function() {
      syncedUser.$destroy();
    });
  };

  this.getGoal = function() {
    if (syncedGoal === undefined) {
      syncedGoal = FirebaseService.getObject(GOAL_NODE + SessionService.currentSession('goalId'));
    }

    return syncedGoal;
  };

  this.getPreparedUntilDate = function(monthsOverride) {
    var months = syncedGoal.months;
    if (monthsOverride !== undefined) {
      months = monthsOverride;
    }

    return Date.today().add(months).months().toString('MMMM dd, yyyy');
  };

  var _createNewGoal = function(syncedUser) {
    var newGoalId = GuidService.generateGuid();
    syncedGoal = FirebaseService.getObject(GOAL_NODE + newGoalId);

    return syncedGoal.$loaded().then(function() {
      syncedGoal.owner = syncedUser.uid;
      syncedGoal.months = DEFAULT_GOAL_MONTHS;
      syncedGoal.days = DEFAULT_GOAL_DAYS;

      return syncedGoal.$save().then(function() {
        syncedUser.goalId = newGoalId;
        return syncedUser.$save();
      });
    });
  };

  var _updateExistingGoal = function(syncedUser) {
    syncedGoal = FirebaseService.getObject(GOAL_NODE + syncedUser.goalId);

    return syncedGoal.$loaded().then(function() {
      // Update goal schema as necessary
      return syncedGoal.$save();
    });
  };
}]);
