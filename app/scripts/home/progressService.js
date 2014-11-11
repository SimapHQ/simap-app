'use strict';

var app = angular.module('simapApp');

app.service('ProgressService', [
  '$log',
  'BASELINE_PLAN_TYPE',
  'CategoriesService',
  'ConversionsService',
  'DAYS_IN_MONTH',
  'DAYS_IN_WEEK',
  'DAYS_IN_YEAR',
  'FamilyService',
  'GoalService',
  'ItemsService',
  'PlansService',
  'RATIONED_PLAN_TYPE',
  'TIME_DAY',
  'TIME_MONTH',
  'TIME_WEEK',
  'TIME_YEAR',
  function (
    $log,
    BASELINE_PLAN_TYPE,
    CategoriesService,
    ConversionsService,
    DAYS_IN_MONTH,
    DAYS_IN_WEEK,
    DAYS_IN_YEAR,
    FamilyService,
    GoalService,
    ItemsService,
    PlansService,
    RATIONED_PLAN_TYPE,
    TIME_DAY,
    TIME_MONTH,
    TIME_WEEK,
    TIME_YEAR
  ) {

  var categories = CategoriesService.getCategories();
  var items = ItemsService.getItems();
  var conversions = ConversionsService.getConversions();
  var plans = PlansService.getPlans();
  var goal = GoalService.getGoal();
  var family = FamilyService.getFamily();

  var isBaselineMet = function(itemId) {
    var item = items[itemId],
        plan = plans[items[itemId].plan_id];

    if (plan.type !== BASELINE_PLAN_TYPE) {
      $log.error('isBaselineMet called on item with non-baseline plan', item, plan);
      return;
    }

    var itemAmount = item.amount;
    if (plan.unit_id !== item.primary_unit) {
      itemAmount = itemAmount * conversions[item.primary_unit][plan.unit_id];
    }

    return itemAmount >= plan.amount;
  };

  var unique = function(value, index, self) {
    return self.indexOf(value) === index;
  }

  var countCategoriesWithRations = function() {
    var categoriesContainingRations = [];

    Object.keys(items).forEach(function(itemId) {
      if (plans[items[itemId].plan_id].type === RATIONED_PLAN_TYPE) {
        categoriesContainingRations.push(items[itemId].category_id);
      }
    });

    return categoriesContainingRations.filter(unique).length;
  };

  var countRationItemsInCategory = function(categoryId) {
    var itemCount = 0;

    Object.keys(items).forEach(function(itemId) {
      if (plans[items[itemId].plan_id].type === RATIONED_PLAN_TYPE &&
          items[itemId].category_id === categoryId) {
        itemCount += 1;
      }
    });

    return itemCount;
  };

  var convertToPerDay = function(amount, from) {
    if (from === TIME_DAY) {
      return amount;
    } else if (from === TIME_WEEK) {
      return amount / DAYS_IN_WEEK;
    } else if (from === TIME_MONTH) {
      return amount / DAYS_IN_MONTH;
    } else if (from === TIME_YEAR) {
      return amount / DAYS_IN_YEAR;
    }
  };

  var calculateRationGoal = function(item, plan) {
    // Convert amounts to primary units
    var adultAmount = plan.adult.amount,
        childAmount = plan.child.amount;

    if (plan.adult.unit_id !== item.primary_unit) {
      adultAmount = adultAmount * conversions[plan.adult.unit_id][item.primary_unit];
    }

    if (plan.child.unit_id !== item.primary_unit) {
      childAmount = childAmount * conversions[plan.child.unit_id][item.primary_unit];
    }

    // Convert amount to day-scope, if not already.
    adultAmount = convertToPerDay(adultAmount, plan.adult.time);
    childAmount = convertToPerDay(childAmount, plan.child.time);

    // Account for each family member
    adultAmount = adultAmount * family.adults;
    childAmount = childAmount * family.children;

    return adultAmount + childAmount;
  };

  var calculateItemProgress = function(itemId) {
    var item = items[itemId],
        plan = plans[items[itemId].plan_id];

    if (plan.type !== RATIONED_PLAN_TYPE) {
      $log.error('calculateItemProgress called on item with non-ration plan', item, plan);
      return;
    }

    var neededPerDay = calculateRationGoal(item, plan);

    return Math.min(item.amount / (neededPerDay * goal.days), 1.0);
  };

  var _calculateRationProgress = function(categoryId) {
    var totalProgress = 0.0,
        itemProgress = [];

    Object.keys(items).forEach(function(itemId) {
      if ((categoryId !== undefined && items[itemId].category_id !== categoryId) ||
          plans[items[itemId].plan_id].type !== RATIONED_PLAN_TYPE) {
        return;
      }

      itemProgress.push(calculateItemProgress(itemId));
    });

    if (itemProgress.length === 0) {
      return 0;
    }

    totalProgress = itemProgress.reduce(function(previousValue, currentValue) {
      return previousValue + (currentValue / itemProgress.length);
    }, 0.0);

    return totalProgress;
  };

  this.countMetBaselines = function(categoryId) {
    var met = 0;

    Object.keys(items).forEach(function(itemId) {
      var item = items[itemId];
      if (categoryId !== undefined && item.category_id !== categoryId) {
        return;
      }

      if (plans[item.plan_id].type === BASELINE_PLAN_TYPE && isBaselineMet(itemId)) {
        met += 1;
      }
    });

    return met;
  };

  this.countTotalBaselines = function(categoryId) {
    var total = 0;

    Object.keys(items).forEach(function(itemId) {
      var item = items[itemId];
      if (categoryId !== undefined && item.category_id !== categoryId) {
        return;
      }

      if (plans[item.plan_id].type === BASELINE_PLAN_TYPE) {
        total += 1;
      }
    });

    return total;
  };

  this.calculateRationProgress = _calculateRationProgress;

  this.getOverallProgressBarItems = function() {
    var items = {},
        categoriesWithRationsCount = countCategoriesWithRations();

    Object.keys(categories).forEach(function(categoryId) {
      items[categoryId] = {
        name: categories[categoryId],
        width: _calculateRationProgress(categoryId) / categoriesWithRationsCount,
        color: categories[categoryId].color
      };
    });

    return items;
  };

  this.getCategoryProgressBarItems = function(categoryId) {
    var progressItems = {},
        rationItemCount = countRationItemsInCategory(categoryId);

    Object.keys(items).forEach(function(itemId) {
      if (items[itemId].category_id !== categoryId ||
          plans[items[itemId].plan_id].type !== RATIONED_PLAN_TYPE) {
        return;
      }

      progressItems[itemId] = {
        name: items[itemId].name,
        width: calculateItemProgress(itemId) / rationItemCount,
        color: items[itemId].color
      };
    });

    return progressItems;
  };

}]);
