'use strict';

var app = angular.module('simapApp');

app.controller('CategoryCtrl', [
  '$location',
  '$routeParams',
  '$scope',
  'CATEGORIES',
  'CategoriesService',
  function (
    $location,
    $routeParams,
    $scope,
    CATEGORIES,
    CategoriesService
  ) {

  var categoryId = $routeParams.categoryId;

  $scope.category = CategoriesService.getCategories()[categoryId];

  $scope.save = function() {
    $scope.category.$save().then(function() {
      $location.path(CATEGORIES);
    });
  };

}]);
