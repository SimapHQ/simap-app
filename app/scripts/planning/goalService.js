'use strict';

var app = angular.module('simapApp');

app.service('GoalService', [
  function(
  ) {

  this.getPreparedUntilDate = function(goal) {
    var months = goal.months;

    return Date.today().add(months).months().toString('MMMM dd, yyyy');
  };

}]);
