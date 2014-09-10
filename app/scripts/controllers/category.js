'use strict';

var app = angular.module('simapApp');

app.controller('CategoryCtrl', function ($scope, $location, randomColor) {
  $scope.name = '';

  $scope.color = randomColor();

  $scope.save = function() {
    $location.path('/categories');
  };
});
