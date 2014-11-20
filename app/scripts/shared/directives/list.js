'use strict';

var app = angular.module('simapApp');

app.directive('simapList', function() {
  var linkFn = function(scope) {
    scope.dataArray = [];
    Object.keys(scope.data).forEach(function(id) {
        scope.dataArray.push(scope.data[id]);
    });
  };

  return {
    restrict: 'E',
    scope: {
        data: '=',
        add: '&onAdd',
        edit: '&onEdit',
        remove: '&onRemove'
    },
    templateUrl: 'views/templates/list.html',
    link: linkFn
  };
});
