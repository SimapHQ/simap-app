'use strict';

var app = angular.module('simapApp');

app.constant('HOME', '/home');
app.constant('LOGIN', '/login');

app.constant('FIREBASE_URL', 'https://simap.firebaseio.com/');
app.constant('USER_NODE', 'user/');
app.constant('FAMILY_NODE', 'family/');
app.constant('GOAL_NODE', 'goal/');

app.constant('DEFAULT_FAMILY_SIZE_ADULTS', 1);
app.constant('DEFAULT_FAMILY_SIZE_CHILDREN', 0);

// From https://www.google.com/webhp?ion=1&espv=2&ie=UTF-8#q=number%20of%20days%20in%20months
app.constant('DAYS_IN_MONTH', 30.4368);

app.constant('DEFAULT_GOAL_DAYS', 90);
