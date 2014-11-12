'use strict';

var app = angular.module('simapApp');

app.directive('simapProgressBar', function() {
  var linkFn = function(scope, element) {
    scope.barWidth = element[0].offsetWidth;
  };

  return {
    restrict: 'E',
    replace: true,
    scope: {
      items: '='
    },
    templateUrl: 'views/templates/progress-bar.html',
    link: linkFn
  };
});
