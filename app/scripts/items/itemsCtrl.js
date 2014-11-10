'use strict';

var app = angular.module('simapApp');

app.controller('ItemsCtrl', [
  '$location',
  '$scope',
  'ItemService',
  'ItemsService',
  function (
    $location,
    $scope,
    ItemService,
    ItemsService
    ) {

  $scope.helpBlock = '';

  $scope.items = ItemsService.getItems();

  $scope.addNewItem = function() {
    ItemService.createNew().then(function(newItemId) {
      $scope.editItem(newItemId);
    });
  };

  $scope.editItem = function(key) {
    $location.path('/item/edit/' + key);
  };

  $scope.removeItem = function(key) {
    // TODO: Ask for confirmation!
    ItemService.removeOld(key).then(function() {
      // refresh();
    });
  };

}]);
