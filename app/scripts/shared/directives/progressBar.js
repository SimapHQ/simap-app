'use strict';

var app = angular.module('simapApp');

app.directive('simapProgressBar', function() {
  var linkFn = function(scope, element) {
    var barWidth = element[0].offsetWidth;
    var items = scope.items;

    Object.keys(items).forEach(function(item) {
      item = items[item];
      if (item.width === 0.0) {
        return;
      }

      var segment =  angular.element('<div class=\"segment\"></div>');
      segment.css({
        backgroundColor: item.color,
        width: item.width * barWidth
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
});
