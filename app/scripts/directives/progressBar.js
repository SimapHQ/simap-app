'use strict';

var app = angular.module('simapApp');
 
app.directive('simapProgressBar', ['randomColor', function(randomColor) {
  var linkFn = function(scope, element) {
    var barWidth = element[0].offsetWidth;
    var items = scope.items;

    Object.keys(items).forEach(function(item) {
      item = items[item];
      var segment =  angular.element('<div class=\"segment\"></div>');
      segment.css({
        // backgroundColor: item.color,
        // width: item.width * barWidth
        backgroundColor: randomColor(),
        width: ((Math.random() * 20 + 10) / 100) * barWidth
      });
      element.append(segment);
    });
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
}]);
