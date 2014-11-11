'use strict';

var app = angular.module('simapApp');

app.constant('HOME', '/home');
app.constant('LOGIN', '/login');
app.constant('CATEGORIES', '/categories');

app.constant('FIREBASE_URL', 'https://simap-test.firebaseio.com/');

app.constant('USER_NODE', 'user/');
app.constant('FAMILY_NODE', 'family/');
app.constant('GOAL_NODE', 'goal/');
app.constant('CATEGORY_NODE', 'category/');
app.constant('ITEM_NODE', 'item/');
app.constant('PLAN_NODE', 'plan/');
app.constant('UNIT_NODE', 'unit/');
app.constant('CONVERSION_NODE', 'conversion/');

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
