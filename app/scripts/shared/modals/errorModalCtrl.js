'use strict';

angular.module('simapApp').controller('ErrorModalCtrl', [
  '$scope',
  'data',
  function (
    $scope,
    data
    ) {

  $scope.error = data;

}]);
