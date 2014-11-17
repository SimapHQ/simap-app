'use strict';

var app = angular.module('simapApp');

app.controller('CategoryCtrl', [
  '$location',
  '$routeParams',
  '$rootScope',
  '$scope',
  'CATEGORIES',
  'CategoriesService',
  'SimapModalService',
  'URIParser',
  'WaitingService',
  function (
    $location,
    $routeParams,
    $rootScope,
    $scope,
    CATEGORIES,
    CategoriesService,
    SimapModalService,
    URIParser,
    WaitingService
  ) {

  var categoryId = $routeParams.categoryId,
      backup = {},
      stopListeningFn;

  $scope.category = CategoriesService.getCategories()[categoryId];

  var stopListeningFn;
  stopListeningFn = $rootScope.$on('$locationChangeStart', function(event, newState) {
    if ($scope.categoryForm.$pristine) {
      return;
    }

    SimapModalService.confirmNavigation().then(function(confirmed) {
      if (!confirmed) {
        return;
      }

      stopListeningFn();
      CategoriesService.revertToServer(categoryId).then(function() {
        $location.path(URIParser.parse(newState).pathname);
      });
    });

    event.preventDefault();
  });

  $scope.save = function() {
    WaitingService.beginWaiting();
    $scope.category.$save().then(function() {
      $scope.categoryForm.$setPristine();
      $location.path(CATEGORIES);
      WaitingService.doneWaiting();
    });
  };

}]);
