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
    $scope.items = ListService.getList('items');
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
    ItemService.removeOld(key).then(function() {
      refresh();
    });
  };

  refresh();
}]);
