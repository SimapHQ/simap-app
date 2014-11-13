'use strict';

angular.module('simapApp').controller('WaitingCtrl', [
  '$scope',
  'WaitingService',
  function (
    $scope,
    WaitingService
  ) {

  $scope.isWaiting = WaitingService.isWaiting;

}]);
