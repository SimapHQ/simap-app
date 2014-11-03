'use strict';

var app = angular.module('simapApp');

app.service('FirebaseService', [
  '$firebase',
  'FIREBASE_URL',
  function(
    $firebase,
    FIREBASE_URL
  ) {

  var firebaseRef = new Firebase(FIREBASE_URL);

  this.getRef = function() {
    return firebaseRef;
  };

  this.getObject = function(path) {
    return $firebase(firebaseRef.child(path)).$asObject();
  };

}]);
