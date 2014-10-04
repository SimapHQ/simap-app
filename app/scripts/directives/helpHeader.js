'use strict';

var app = angular.module('simapApp');
 
app.directive('simapHelpHeader', function() {
  var getTemplateUrl = function($templateElement, $templateAttributes) {
    var size = $templateAttributes.size;
    return 'views/templates/' + size + '-help-header.html';
  };

  return {
    restrict: 'E',
    scope: {
      helpBlock: '=',
      label: '=',
      size: '='
    },
    templateUrl: getTemplateUrl
  };
});
