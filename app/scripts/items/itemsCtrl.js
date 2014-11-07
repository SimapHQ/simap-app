'use strict';

var app = angular.module('simapApp');

app.controller('ItemsCtrl', [
  '$location',
  '$scope',
  'ItemService',
  'ListService',
  function (
    $location,
    $scope,
    ItemService,
    ListService
    ) {

  $scope.helpBlock = '';

  var refresh = function() {
    ListService.getList('items').then(function(items) {
      $scope.items = items;
    });
  };

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
      refresh();
    });
  };

  refresh();
}]);
