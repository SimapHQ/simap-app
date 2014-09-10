'use strict';

var app = angular.module('simapApp');
 
app.directive('simapList', function() {
  return {
    restrict: 'E',
    scope: {
        data: '=',
        add: '&onAdd',
        edit: '&onEdit',
        remove: '&onRemove'
    },
    templateUrl: '/views/templates/list.html'
  };
});
