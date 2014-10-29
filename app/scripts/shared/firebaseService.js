'use strict';

var app = angular.module('simapApp');

app.service('FirebaseService', ['FIREBASE_URL', function(FIREBASE_URL) {

  var firebaseRef = new Firebase(FIREBASE_URL);

  this.getRef = function() {
    return firebaseRef;
  };

}]);
