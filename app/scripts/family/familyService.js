'use strict';

var app = angular.module('simapApp');

app.service('FamilyService', [
  '$firebase',
  '$log',
  '$q',
  'FirebaseService',
  'USER_NODE', 
  function(
    $firebase, 
    $log, 
    $q, 
    FirebaseService, 
    USER_NODE
  ) {
  var firebaseRef = FirebaseService.getRef();

  this.updateUser = function(syncedUser) {
    // If syncedUser has a family, update it.
    // 
    // If they don't, create one, bind it to them, then update it.
  };

  var _createNewFamily = function() {

  };

  var _updateExistingFamily = function() {

  };
}]);
