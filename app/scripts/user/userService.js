'use strict';

var app = angular.module('simapApp');

app.service('UserService', [
  '$firebase',
  '$log',
  '$q',
  'FirebaseService',
  'GoalService',
  'USER_NODE',
  function(
    $firebase,
    $log,
    $q,
    FirebaseService,
    GoalService,
    USER_NODE
  ) {

  var firebaseRef = FirebaseService.getRef();

  this.updateUser = function(user) {
    var syncedUser = $firebase(firebaseRef.child(USER_NODE + user.uid)).$asObject();
    return syncedUser.$loaded().then(function() {
      if (syncedUser.$value !== undefined && syncedUser.$value === null) {
        return _createNewUser(user, syncedUser);
      } else {
        return _updateExistingUser(user, syncedUser);
      }
    }).finally(function() {
      syncedUser.$destroy();
    });
  };

  var _createNewUser = function(user, syncedUser) {
    syncedUser.uid = user.uid;
    syncedUser.provider = user.provider;
    syncedUser.providerUid = user.id;
    syncedUser.displayName = user.displayName;
    syncedUser.createdAt = Firebase.ServerValue.TIMESTAMP;
    syncedUser.lastLogin = Firebase.ServerValue.TIMESTAMP;

    return syncedUser.$save();
  };

  var _updateExistingUser = function(user, syncedUser) {
    syncedUser.displayName = user.displayName;
    syncedUser.createdAt = syncedUser.createdAt || Firebase.ServerValue.TIMESTAMP;
    syncedUser.lastLogin = Firebase.ServerValue.TIMESTAMP;
    return syncedUser.$save();
  };

}]);
