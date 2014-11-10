'use strict';

var app = angular.module('simapApp');

app.service('ProgressService', [
  '$log',
  'BASELINE_PLAN_TYPE',
  'CategoriesService',
  'ConversionsService',
  'GoalService',
  'ItemsService',
  'PlansService',
  'UnitsService',
  function (
    $log,
    BASELINE_PLAN_TYPE,
    CategoriesService,
    ConversionsService,
    GoalService,
    ItemsService,
    PlansService,
    UnitsService
  ) {

  var categories = CategoriesService.getCategories();
  var items = ItemsService.getItems();
  var units = UnitsService.getUnits();
  var conversions = ConversionsService.getConversions();
  var plans = PlansService.getPlans();

  var isBaselineMet = function(itemId) {
    var item = items[itemId],
        plan = plans[items[itemId].plan_id];

    if (plan.type !== BASELINE_PLAN_TYPE) {
      $log.warn('isBaselineMet called on item with non-baseline plan', item, plan);
      return;
    }

    var itemAmount = item.amount;
    if (plan.unit_id !== item.primary_unit) {
      itemAmount = itemAmount * conversions[item.primary_unit][plan.unit_id];
    }

    return itemAmount >= plan.amount;
  };

  this.countBaselines = function(categoryId) {
    var met = 0,
        total = 0;

    Object.keys(items).forEach(function(itemId) {
      var item = items[itemId];
      if (categoryId !== undefined && item.category_id !== categoryId) {
        return;
      }

      if (plans[item.plan_id].type === BASELINE_PLAN_TYPE) {
        total += 1;

        if (isBaselineMet(itemId)) {
          met += 1;
        }
      }
    });

    return {met: met, total: total};
  };

  this.getItemProgress = function(itemId) {

  };

}]);
