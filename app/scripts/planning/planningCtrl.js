'use strict';

angular.module('simapApp').controller('PlanningCtrl', [
  '$firebase',
  '$location',
  '$q',
  '$rootScope',
  '$scope',
  'DataService',
  'DAYS_IN_MONTH',
  'FAMILY_TYPE',
  'GoalService',
  'GOAL_TYPE',
  'PATH_TO_HOME',
  'SimapModalService',
  'URIParser',
  'WaitingService',
  function (
    $firebase,
    $location,
    $q,
    $rootScope,
    $scope,
    DataService,
    DAYS_IN_MONTH,
    FAMILY_TYPE,
    GoalService,
    GOAL_TYPE,
    PATH_TO_HOME,
    SimapModalService,
    URIParser,
    WaitingService
  ) {

    var stopListeningFn;

    stopListeningFn = $rootScope.$on('$locationChangeStart', function(event, newState) {
      if ($scope.familyForm.$pristine && $scope.goalForm.$pristine) {
        return;
      }

      SimapModalService.confirmNavigation().then(function(confirmed) {
        if (!confirmed) {
          return;
        }

        WaitingService.beginWaiting();
        stopListeningFn();
        $q.all([
          DataService.revertSingle(FAMILY_TYPE, $scope.family.$id),
          DataService.revertSingle(GOAL_TYPE, $scope.goal.$id)
        ]).then(function() {
          $location.path(URIParser.parse(newState).pathname);
          WaitingService.doneWaiting();
        });
      });

      event.preventDefault();
    });

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
