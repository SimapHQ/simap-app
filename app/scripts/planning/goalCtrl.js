'use strict';

angular.module('simapApp').controller('GoalCtrl', [
  '$firebase',
  '$scope',
  'DAYS_IN_MONTH',
  'FirebaseService',
  'GOAL_NODE',
  'GoalService',
  'SessionService',
  function (
    $firebase,
    $scope,
    DAYS_IN_MONTH,
    FirebaseService,
    GOAL_NODE,
    GoalService,
    SessionService
    ) {

    var ref = FirebaseService.getRef(),
        goal_id = SessionService.currentSession().goal_id;

    $firebase(ref.child(GOAL_NODE + goal_id + '/days')).$asObject().$bindTo($scope, 'days').then(function() {
      $scope.months = Math.round($scope.days.$value / DAYS_IN_MONTH);
      $scope.updatePreparedUntilDate();
    });

    $scope.monthsChanged = function() {
      if ($scope.months === undefined || $scope.months === null) {
        return;
      }

      $scope.days.$value = Math.round($scope.months * DAYS_IN_MONTH);
      $scope.updatePreparedUntilDate();
    };

    $scope.updatePreparedUntilDate = function() {
      $scope.preparedUntilDate = Date.today().add($scope.months).months().toString('MMMM dd, yyyy');
    };
}]);
