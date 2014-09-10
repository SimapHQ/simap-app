'use strict';

var app = angular.module('simapApp');

app.service('randomColor', function() {
  return function() {
    return randomColor({
      luminosity: 'bright', 
      format: 'hex'
    });
  };
});
