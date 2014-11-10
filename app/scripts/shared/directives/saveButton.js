'use strict';

var app = angular.module('simapApp');
 
app.directive('simapSaveButton', function() {
  return {
    restrict: 'E',
    scope: {
        save: '&onSave',
    },
    templateUrl: 'views/templates/save-button.html'
  };
});
