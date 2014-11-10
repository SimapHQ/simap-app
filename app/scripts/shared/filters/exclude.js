'use strict';

var app = angular.module('simapApp');

app.filter('simapExclude', function() {
  return function(items, valueToExclude) {
    var filtered = {};

    angular.forEach(items, function(item) {
      if (item.$id !== valueToExclude){
        filtered[item.$id] = item;
      }
    });

    return filtered;
  };
});
