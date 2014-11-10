'use strict';

var app = angular.module('simapApp');

app.controller('UnitCtrl', [
  '$scope',
  function (
    $scope
  ) {

  $scope.editing = false;

  $scope.startEdit = function() {
    $scope.editedUnitName = $scope.unit.name;
    $scope.editing = true;
  };

  $scope.finishEdit = function() {
    $scope.unit.name = $scope.editedUnitName;
    $scope.editing = false;
  };

}]);
