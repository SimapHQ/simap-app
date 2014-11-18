'use strict';

var app = angular.module('simapApp');

app.constant('PATH_TO_HOME', '/home');
app.constant('PATH_TO_LOGIN', '/login');
app.constant('PATH_TO_CATEGORIES', '/categories');

app.constant('FIREBASE_URL', 'https://simap-dev.firebaseio.com/userData');

app.constant('CATEGORY_NODE', 'category/');
app.constant('CONVERSION_NODE', 'conversion/');
app.constant('FAMILY_NODE', 'family/');
app.constant('GOAL_NODE', 'goal/');
app.constant('HISTORY_NODE', 'history/');
app.constant('ITEM_NODE', 'item/');
app.constant('PLAN_NODE', 'plan/');
app.constant('UNIT_NODE', 'unit/');
app.constant('USER_NODE', 'user/');

app.constant('CATEGORY_TYPE', 'categories');
app.constant('ITEM_TYPE', 'items');
app.constant('UNIT_TYPE', 'units');
app.constant('CONVERSION_TYPE', 'conversions');
app.constant('PLAN_TYPE', 'plans');
app.constant('FAMILY_TYPE', 'family');
app.constant('GOAL_TYPE', 'goal');

app.constant('DEFAULT_FAMILY_SIZE_ADULTS', 1);
app.constant('DEFAULT_FAMILY_SIZE_CHILDREN', 0);

// From https://www.google.com/webhp?ion=1&espv=2&ie=UTF-8#q=number%20of%20days%20in%20months
app.constant('DAYS_IN_WEEK', 7.0);
app.constant('DAYS_IN_MONTH', 30.4368);
app.constant('DAYS_IN_YEAR', 365.242);

app.constant('DEFAULT_GOAL_MONTHS', 3);
app.constant('DEFAULT_GOAL_DAYS', 91);

app.constant('DEFAULT_CATEGORY_NAME', 'New Category Name');
app.constant('DEFAULT_ITEM_NAME', 'New Item Name');
app.constant('DEFAULT_UNIT_NAME', 'New Unit Name');

app.constant('RATIONED_PLAN_TYPE', 'ration');
app.constant('BASELINE_PLAN_TYPE', 'baseline');

app.constant('DEFAULT_PLAN_AMOUNT', 1);
app.constant('DEFAULT_PLAN_TIME', 'day');

app.constant('DEFAULT_CONVERSION_VALUE', 1.0);

app.constant('TIME_DAY', 'day');
app.constant('TIME_WEEK', 'week');
app.constant('TIME_MONTH', 'month');
app.constant('TIME_YEAR', 'year');

app.constant('ITEM_AMOUNT_CHANGED_EVENT', 'simap:itemAmountChanged');
app.constant('ITEM_PRIMARY_UNIT_CHANGED_EVENT', 'simap:itemPrimaryUnitChanged');
