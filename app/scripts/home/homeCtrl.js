'use strict';

angular.module('simapApp').controller('HomeCtrl', [
  '$scope',
  'CONVERSION_NODE',
  'FamilyService',
  'FirebaseService',
  'GoalService',
  'ITEM_NODE',
  'PLAN_NODE',
  'randomColor',
  'SessionService',
  'UnitService',
  function (
    $scope,
    CONVERSION_NODE,
    FamilyService,
    FirebaseService,
    GoalService,
    ITEM_NODE,
    PLAN_NODE,
    randomColor,
    SessionService,
    UnitService
  ) {

  var refreshHomeData = function() {
    $scope.family = FamilyService.getFamily();
    $scope.goal = GoalService.getGoal();

    $scope.categories = {};
    $scope.items = {};
    $scope.units = {};
    $scope.plans = {};
    $scope.conversions = {};

    refreshCategories().then(function() {
      Object.keys(SessionService.currentSession('items')).forEach(function(itemId) {
        loadItem(itemId).then(function(loadedItem) {
          $scope.items[loadedItem.category_id][itemId] = loadedItem;

          FirebaseService.getRef().child(PLAN_NODE + loadedItem.plan_id).once('value', function(dataSnapshot) {
            $scope.plans[loadedItem.category_id][itemId] = dataSnapshot.val();
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
    });
  };

  var refreshCategories = function() {
    return ListService.getList('categories').then(function(categories) {
      $scope.categories = categories;

      Object.keys(categories).forEach(function(categoryId) {
        $scope.items[categoryId] = {};
        $scope.plans[categoryId] = {};
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

  $scope.isBaselineMet = function(categoryId, itemId) {
    if ($scope.items[categoryId] === undefined ||
        $scope.items[categoryId][itemId] === undefined) {
      return false;
    }

    var item = $scope.items[categoryId][itemId];
    var plan = $scope.plans[categoryId][item.plan_id];

    if (item === undefined || plan === undefined) {
      return false;
    }

    var necessary = plan.amount;
    if (plan.unit_id !== item.primary_unit) {
      necessary = necessary * $scope.conversion[plan.unit_id][item.primary_unit];
    }

    return item.amount >= necessary;
  };


  $scope.overallProgressItems = {};
  $scope.preparedUntilDate = GoalService.getPreparedUntilDate();

  refreshHomeData();

}]);
