'use strict';

angular.module('simapApp').controller('GoalCtrl', [
  '$firebase',
  '$scope',
  'DAYS_IN_MONTH',
  'FirebaseService',
  'GOAL_NODE',
  'SessionService',
  function (
    $firebase,
    $scope,
    DAYS_IN_MONTH,
    FirebaseService,
    GOAL_NODE,
    SessionService
    ) {

    $scope.update = function() {
      if ($scope.goal === undefined || $scope.goal === null) {
        return;
      }

      $scope.preparedUntilDate = Date.today().add($scope.goal.months).months().toString('MMMM dd, yyyy');
      $scope.goal.days = Math.round($scope.goal.months * DAYS_IN_MONTH);
    };

    var ref = FirebaseService.getRef(),
        goal_id = SessionService.currentSession().goal_id;

    var goalObject = $firebase(ref.child(GOAL_NODE + goal_id)).$asObject();
    goalObject.$bindTo($scope, 'goal').then($scope.update);
    goalObject.$watch($scope.update);
}]);
