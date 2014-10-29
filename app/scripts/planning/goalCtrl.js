'use strict';

angular.module('simapApp').controller('GoalCtrl', [
  '$firebase',
  '$scope',
  'GOAL_NODE',
  'FirebaseService',
  'GoalService',
  'SessionService',
  function (
    $firebase,
    $scope,
    GOAL_NODE,
    FirebaseService,
    GoalService,
    SessionService
    ) {

    var ref = FirebaseService.getRef();
    var goal_id = SessionService.currentSession().goal_id;

    $firebase(ref.child(GOAL_NODE + goal_id + '/days')).$asObject().$bindTo($scope, 'days');
}]);
