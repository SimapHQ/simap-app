'use strict';

var app = angular.module('simapApp');

app.service('HistoryService', [
  '$firebase',
  'FirebaseService',
  'HISTORY_NODE',
  function (
    $firebase,
    FirebaseService,
    HISTORY_NODE
  ) {

  var firebaseRef = FirebaseService.getRef();

  this.addEvent = function(itemId, eventObj) {
    var history = $firebase(firebaseRef.child(HISTORY_NODE + itemId));

    $.extend(eventObj, {
      timestamp: Firebase.ServerValue.TIMESTAMP,
      '.priority': Firebase.ServerValue.TIMESTAMP,
    });

    return history.$push(eventObj);
  };

}]);
