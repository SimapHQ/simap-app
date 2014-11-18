'use strict';

angular.module('simapApp').controller('PlanningCtrl', [
  '$firebase',
  '$location',
  '$q',
  '$rootScope',
  '$scope',
  'DataService',
  'DAYS_IN_MONTH',
  'GoalService',
  'PATH_TO_HOME',
  'SimapModalService',
  'WaitingService',
  function (
    $firebase,
    $location,
    $q,
    $rootScope,
    $scope,
    DataService,
    DAYS_IN_MONTH,
    GoalService,
    PATH_TO_HOME,
    SimapModalService,
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

      return GoalService.getPreparedUntilDate($scope.goal);
    };

    $scope.save = function() {
      WaitingService.beginWaiting();

      $q.all([
        $scope.family.$save(),
        $scope.goal.$save()
      ]).then(function() {
        $scope.familyForm.$setPristine();
        $scope.goalForm.$setPristine();
        $location.path(PATH_TO_HOME);
        WaitingService.doneWaiting();
      });
    };

    $scope.family = DataService.getData().family;
    $scope.goal = DataService.getData().goal;

    $scope.helpBlock = 'Once you put in the number of adults and children in your family, Simap can make sure your inventory is sufficient.';
}]);
