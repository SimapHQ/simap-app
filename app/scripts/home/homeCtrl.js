'use strict';

angular.module('simapApp').controller('HomeCtrl', [
  '$scope',
  'CONVERSION_NODE',
  'FirebaseService',
  'ITEM_NODE',
  'ListService',
  'PLAN_NODE',
  'SessionService',
  'UnitService',
  function (
    $scope,
    CONVERSION_NODE,
    FirebaseService,
    ITEM_NODE,
    ListService,
    PLAN_NODE,
    SessionService,
    UnitService
  ) {

  var refreshHomeData = function() {
    $scope.categories = ListService.getList('categories');

    $scope.items = {};
    $scope.units = {};
    $scope.plans = {};
    $scope.conversions = {};

    Object.keys(SessionService.currentSession().items).forEach(function(itemId) {
      loadItem(itemId).then(function(loadedItem) {
        $scope.items[itemId] = loadedItem;

        FirebaseService.getRef().child(PLAN_NODE + loadedItem.plan_id).once('value', function(dataSnapshot) {
          $scope.plans[itemId] = dataSnapshot.val();
        });

        Object.keys(loadedItem.units).forEach(function(unitId) {
          UnitService.getName(unitId).then(function(unitName) {
            $scope.units[unitId] = {name: unitName};
          });

          FirebaseService.getRef().child(CONVERSION_NODE + unitId).once('value', function(dataSnapshot) {
            $scope.conversions[unitId] = dataSnapshot.val();
          });
        });
      });
    });
  };

  // Items are the only things that will be modified from this screen,
  // so they're the only ones that we keep a connection for.
  var loadItem = function(itemId) {
    var itemObj = FirebaseService.getObject(ITEM_NODE + itemId);

    return itemObj.$loaded().then(function() {
      return itemObj;
    });
  };

  refreshHomeData();

}]);
