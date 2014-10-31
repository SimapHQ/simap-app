'use strict';

var app = angular.module('simapApp');

app.controller('CategoryCtrl', [
  '$firebase',
  '$routeParams',
  '$scope',
  'CATEGORY_NODE',
  'FirebaseService',
  function (
    $firebase,
    $routeParams,
    $scope,
    CATEGORY_NODE,
    FirebaseService
  ) {

  var categoryId = $routeParams.categoryId,
      ref = FirebaseService.getRef();

  $firebase(ref.child(CATEGORY_NODE + categoryId)).$asObject().$bindTo($scope, 'category');
}]);
