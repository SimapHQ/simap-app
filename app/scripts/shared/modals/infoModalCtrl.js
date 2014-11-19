'use strict';

angular.module('simapApp').controller('InfoModalCtrl', [
  '$scope',
  'data',
  function (
    $scope,
    data
    ) {

  $scope.info = data;

}]);
