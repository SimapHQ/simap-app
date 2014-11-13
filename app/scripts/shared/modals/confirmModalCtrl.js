'use strict';

angular.module('simapApp').controller('ConfirmModalCtrl', [
  '$scope',
  'data',
  'close',
  function (
    $scope,
    data,
    close
    ) {

  $scope.data = data;

  $scope.confirm = function(actionConfirmed) {
    close(actionConfirmed);
  };

}]);
