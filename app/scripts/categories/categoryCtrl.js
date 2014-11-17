'use strict';

var app = angular.module('simapApp');

app.controller('CategoryCtrl', [
  '$location',
  '$rootScope',
  '$routeParams',
  '$scope',
  'DataService',
  'PATH_TO_CATEGORIES',
  'SimapModalService',
  'URIParser',
  'WaitingService',
  function (
    $location,
    $rootScope,
    $routeParams,
    $scope,
    DataService,
    PATH_TO_CATEGORIES,
    SimapModalService,
    URIParser,
    WaitingService
  ) {

  var categoryId = $routeParams.categoryId,
      stopListeningFn;

  $scope.category = DataService.getData().categories[categoryId];

  stopListeningFn = $rootScope.$on('$locationChangeStart', function(event, newState) {
    if ($scope.categoryForm.$pristine) {
      return;
    }

    SimapModalService.confirmNavigation().then(function(confirmed) {
      if (!confirmed) {
        return;
      }

      stopListeningFn();
      // TODO
      // CategoriesService.revertToServer(categoryId).then(function() {
      //   $location.path(URIParser.parse(newState).pathname);
      // });
    });

    event.preventDefault();
  });

  $scope.save = function() {
    WaitingService.beginWaiting();
    $scope.category.$save().then(function() {
      $scope.categoryForm.$setPristine();
      $location.path(PATH_TO_CATEGORIES);
      WaitingService.doneWaiting();
    });
  };

}]);
