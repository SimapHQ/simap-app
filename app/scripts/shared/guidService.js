'use strict';

var app = angular.module('simapApp');

app.service('GuidService', [function() {
  
  // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  this.generateGuid = function() {
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {

      /*jslint bitwise: true */
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      /*jslint bitwise: false */

      return v.toString(16);
    });

    return guid;
  };

}]);
