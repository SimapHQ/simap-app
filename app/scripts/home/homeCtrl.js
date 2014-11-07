'use strict';

angular.module('simapApp').controller('HomeCtrl', [
  '$scope',
  'FirebaseService',
  'ITEM_NODE',
  'ListService',
  'SessionService',
  'UNIT_NODE',
  function (
    $scope,
    FirebaseService,
    ITEM_NODE,
    ListService,
    SessionService,
    UNIT_NODE
  ) {

  var refreshHomeData = function() {
    $scope.categories = ListService.getList('categories');
    $scope.items = {};
    $scope.units = {};
    $scope.plans = {};
    $scope.conversions = {};

    // Object.keys(SessionService.currentSession().items).forEach(function(itemId) {
    //   $scope.items[itemId] = loadItem(itemId)
    // });
  };

  // var loadItem = function(itemId) {
  //   var itemObj = FirebaseService.getObject(ITEM_NODE + itemId);

  //   return itemObj.$loaded().then(function() {
  //     var unitPromises = [];
  //     Object.keys(itemObj.units).forEach(function(unitId) {
  //       unitPromises.push(FirebaseService.getObject(UNIT_NODE + unitId).$loaded().then(function() {
  //         $scope.units[itemId].units
  //       }));
  //     });

  //     return itemObj;
  //   });
  // };

  refreshHomeData();

}]);
