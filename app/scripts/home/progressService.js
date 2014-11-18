'use strict';

var app = angular.module('simapApp');

app.service('ProgressService', [
  '$log',
  'BASELINE_PLAN_TYPE',
  'DataService',
  'DAYS_IN_MONTH',
  'DAYS_IN_WEEK',
  'DAYS_IN_YEAR',
  'RATIONED_PLAN_TYPE',
  'TIME_DAY',
  'TIME_MONTH',
  'TIME_WEEK',
  'TIME_YEAR',
  function (
    $log,
    BASELINE_PLAN_TYPE,
    DataService,
    DAYS_IN_MONTH,
    DAYS_IN_WEEK,
    DAYS_IN_YEAR,
    RATIONED_PLAN_TYPE,
    TIME_DAY,
    TIME_MONTH,
    TIME_WEEK,
    TIME_YEAR
  ) {

  var data = DataService.getData();

  var isBaselineMet = function(itemId) {
    var item = data.items[itemId],
        plan = data.plans[data.items[itemId].planId];

    if (plan.type !== BASELINE_PLAN_TYPE) {
      $log.error('isBaselineMet called on item with non-baseline plan', item, plan);
      return;
    }

    var itemAmount = item.amount;
    if (plan.unitId !== item.primaryUnitId) {
      itemAmount = itemAmount * data.conversions[item.primaryUnitId][plan.unitId];
    }

    return itemAmount >= plan.amount;
  };

  var unique = function(value, index, self) {
    return self.indexOf(value) === index;
  };

  var countCategoriesWithRations = function() {
    var categoriesContainingRations = [];

    Object.keys(data.items).forEach(function(itemId) {
      if (data.plans[data.items[itemId].planId].type === RATIONED_PLAN_TYPE) {
        categoriesContainingRations.push(data.items[itemId].categoryId);
      }
    });

    return categoriesContainingRations.filter(unique).length;
  };

  var countRationItemsInCategory = function(categoryId) {
    var itemCount = 0;

    Object.keys(data.items).forEach(function(itemId) {
      if (data.plans[data.items[itemId].planId].type === RATIONED_PLAN_TYPE &&
          data.items[itemId].categoryId === categoryId) {
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

    if (plan.adult.unitId !== item.primaryUnitId) {
      adultAmount = adultAmount * data.conversions[plan.adult.unitId][item.primaryUnitId];
    }

    if (plan.child.unitId !== item.primaryUnitId) {
      childAmount = childAmount * data.conversions[plan.child.unitId][item.primaryUnitId];
    }

    // Convert amount to day-scope, if not already.
    adultAmount = convertToPerDay(adultAmount, plan.adult.time);
    childAmount = convertToPerDay(childAmount, plan.child.time);

    // Account for each family member
    adultAmount = adultAmount * data.family.adults;
    childAmount = childAmount * data.family.children;

    return adultAmount + childAmount;
  };

  var calculateItemProgress = function(itemId) {
    var item = data.items[itemId],
        plan = data.plans[data.items[itemId].planId];

    if (plan.type !== RATIONED_PLAN_TYPE) {
      $log.error('calculateItemProgress called on item with non-ration plan', item, plan);
      return;
    }

    var neededPerDay = calculateRationGoal(item, plan);

    return Math.min(item.amount / (neededPerDay * data.goal.days), 1.0);
  };

  var _calculateRationProgress = function(categoryId) {
    var totalProgress = 0.0,
        itemProgress = [];

    Object.keys(data.items).forEach(function(itemId) {
      if ((categoryId !== undefined && data.items[itemId].categoryId !== categoryId) ||
          data.plans[data.items[itemId].planId].type !== RATIONED_PLAN_TYPE) {
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

    Object.keys(data.items).forEach(function(itemId) {
      var item = data.items[itemId];
      if (categoryId !== undefined && item.categoryId !== categoryId) {
        return;
      }

      if (data.plans[item.planId].type === BASELINE_PLAN_TYPE && isBaselineMet(itemId)) {
        met += 1;
      }
    });

    return met;
  };

  this.countTotalBaselines = function(categoryId) {
    var total = 0;

    Object.keys(data.items).forEach(function(itemId) {
      var item = data.items[itemId];
      if (categoryId !== undefined && item.categoryId !== categoryId) {
        return;
      }

      if (data.plans[item.planId].type === BASELINE_PLAN_TYPE) {
        total += 1;
      }
    });

    return total;
  };

  this.calculateRationProgress = _calculateRationProgress;

  this.getOverallProgressBarItems = function() {
    var items = {},
        categoriesWithRationsCount = countCategoriesWithRations();

    Object.keys(data.categories).forEach(function(categoryId) {
      items[categoryId] = {
        name: data.categories[categoryId],
        width: _calculateRationProgress(categoryId) / categoriesWithRationsCount,
        color: data.categories[categoryId].color
      };
    });

    return items;
  };

  this.getCategoryProgressBarItems = function(categoryId) {
    var progressItems = {},
        rationItemCount = countRationItemsInCategory(categoryId);

    Object.keys(data.items).forEach(function(itemId) {
      if (data.items[itemId].categoryId !== categoryId ||
          data.plans[data.items[itemId].planId].type !== RATIONED_PLAN_TYPE) {
        return;
      }

      progressItems[itemId] = {
        name: data.items[itemId].name,
        width: calculateItemProgress(itemId) / rationItemCount,
        color: data.items[itemId].color
      };
    });

    return progressItems;
  };

}]);
