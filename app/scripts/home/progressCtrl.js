'use strict';

angular.module('simapApp').controller('ProgressCtrl', [
  '$scope',
  'ProgressService',
  function (
    $scope,
    ProgressService
  ) {

  $scope.baselinesMet = function() {
    return ProgressService.countBaselines($scope.categoryId).met;
  };

  $scope.totalBaselines = function() {
    return ProgressService.countBaselines($scope.categoryId).total;
  };

}]);
