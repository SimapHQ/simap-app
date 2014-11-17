'use strict';

var app = angular.module('simapApp');

app.service('URIParser', [
  function(
  ) {

  this.parse = function(uriStr) {
    var parsed = document.createElement('a');
    parsed.href = uriStr;

    return parsed;
  };

}]);
