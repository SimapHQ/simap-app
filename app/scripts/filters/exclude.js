'use strict';

var app = angular.module('simapApp');

app.filter('simapExclude', function() {
  return function(items, nameKey, itemToExclude) {
    var filtered = [];
    itemToExclude = itemToExclude[nameKey].trim();

    angular.forEach(items, function(item) {
      if (item[nameKey].trim() !== itemToExclude){
        filtered.push(item);
      }
    });

    return filtered;
  };
});
