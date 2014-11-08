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
  function (
    $firebase,
    $location,
    $q,
    $scope,
    DAYS_IN_MONTH,
    FamilyService,
    HOME,
    GoalService
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

      return Date.today().add($scope.goal.months).months().toString('MMMM dd, yyyy');
    };

    $scope.func = function() {
      return 5;
    }

    $scope.save = function() {
      $q.all([
        $scope.family.$save(),
        $scope.goal.$save()
      ]).then(function() {
        $location.path(HOME);
      });
    };

    $scope.family = FamilyService.getFamily();
    $scope.goal = GoalService.getGoal();

    $scope.helpBlock = 'Once you put in the number of adults and children in your family, Simap can make sure your inventory is sufficient.';
}]);
