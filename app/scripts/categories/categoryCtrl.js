'use strict';

var app = angular.module('simapApp');

app.controller('CategoryCtrl', [
  '$firebase',
  '$location',
  '$routeParams',
  '$scope',
  'CATEGORIES',
  'CategoryService',
  'FirebaseService',
  function (
    $firebase,
    $location,
    $routeParams,
    $scope,
    CATEGORIES,
    CategoryService,
    FirebaseService
  ) {

  var categoryId = $routeParams.categoryId;

  $scope.category = CategoryService.getCategories()[categoryId];

  $scope.save = function() {
    $scope.category.$save().then(function() {
      $location.path(CATEGORIES);
    });
  };

}]);
