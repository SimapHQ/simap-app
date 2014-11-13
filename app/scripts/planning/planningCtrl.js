'use strict';

angular.module('simapApp').controller('PlanningCtrl', [
  '$firebase',
  '$location',
  '$q',
  '$scope',
  'DAYS_IN_MONTH',
  'FamilyService',
  'HOME',
  'GoalService',
  'WaitingService',
  function (
    $firebase,
    $location,
    $q,
    $scope,
    DAYS_IN_MONTH,
    FamilyService,
    HOME,
    GoalService,
    WaitingService
    ) {

    $scope.goalChanged = function() {
      if (!$scope.goalForm.$valid) {
        return;
      }

      $scope.goal.days = Math.round($scope.goal.months * DAYS_IN_MONTH);
    };

    $scope.preparedUntilDate = function() {
      if ($scope.goal.months === undefined) {
        return 'Calculating...';
      }

      return GoalService.getPreparedUntilDate($scope.goal.months);
    };

    $scope.save = function() {
      WaitingService.beginWaiting();

      $q.all([
        $scope.family.$save(),
        $scope.goal.$save()
      ]).then(function() {
        $location.path(HOME);
        WaitingService.doneWaiting();
      });
    };

    $scope.family = FamilyService.getFamily();
    $scope.goal = GoalService.getGoal();

    $scope.helpBlock = 'Once you put in the number of adults and children in your family, Simap can make sure your inventory is sufficient.';
}]);
