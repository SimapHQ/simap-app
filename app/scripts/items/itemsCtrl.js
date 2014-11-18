'use strict';

var app = angular.module('simapApp');

app.controller('ItemsCtrl', [
  '$location',
  '$scope',
  'ItemService',
  'DataService',
  'SimapModalService',
  'WaitingService',
  function (
    $location,
    $scope,
    ItemService,
    DataService,
    SimapModalService,
    WaitingService
    ) {

  $scope.helpBlock = '';

  $scope.items = DataService.getData().items;

  $scope.addNewItem = function() {
    if ($.isEmptyObject(DataService.getData().categories)) {
      SimapModalService.showError({
        title: 'Can\'t Create Item',
        msg: 'You must create a category before you can create a new item!'
      });

      return;
    }

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
    SimapModalService.confirmAction({
      title: 'Delete Item?',
      msg: 'Are you sure you want to delete the item "' + $scope.items[key].name + '?" This cannot be undone!'
    }).then(function(confirmed) {
      if (!confirmed) {
        return;
      }

      WaitingService.beginWaiting();
      ItemService.removeOld(key).then(function() {
        WaitingService.doneWaiting();
      });
    });
  };

}]);
