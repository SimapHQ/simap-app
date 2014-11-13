'use strict';

var app = angular.module('simapApp');

app.controller('CategoryCtrl', [
  '$location',
  '$routeParams',
  '$scope',
  'CATEGORIES',
  'CategoriesService',
  'WaitingService',
  function (
    $location,
    $routeParams,
    $scope,
    CATEGORIES,
    CategoriesService,
    WaitingService
  ) {

  var categoryId = $routeParams.categoryId;

  $scope.category = CategoriesService.getCategories()[categoryId];

  $scope.save = function() {
    WaitingService.beginWaiting();
    $scope.category.$save().then(function() {
      $location.path(CATEGORIES);
      WaitingService.doneWaiting();
    });
  };

}]);
