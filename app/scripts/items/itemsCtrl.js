'use strict';

var app = angular.module('simapApp');

app.controller('ItemsCtrl', [
  '$location',
  '$scope',
  'ItemService',
  'ItemsService',
  'WaitingService',
  function (
    $location,
    $scope,
    ItemService,
    ItemsService,
    WaitingService
    ) {

  $scope.helpBlock = '';

  $scope.items = ItemsService.getItems();

  $scope.addNewItem = function() {
    WaitingService.beginWaiting();
    ItemService.createNew().then(function(newItemId) {
      $scope.editItem(newItemId);
      WaitingService.doneWaiting();
    });
  };

  $scope.editItem = function(key) {
    $location.path('/item/edit/' + key);
  };

  $scope.removeItem = function(key) {
    // TODO: Ask for confirmation!
    WaitingService.beginWaiting();
    ItemService.removeOld(key).then(function() {
      WaitingService.doneWaiting();
    });
  };

}]);
