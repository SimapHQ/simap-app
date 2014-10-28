'use strict';

var app = angular.module('simapApp');

app.service('UserService', [
  '$firebase',
  '$log',
  '$q',
  'FamilyService',
  'FirebaseService',
  'GoalService',
  'USER_NODE', 
  function(
    $firebase, 
    $log, 
    $q, 
    FamilyService,
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
    }, function(error) {
      $log.error('error getting syncedUser', error);
    });
  };

  var _createNewUser = function(user, syncedUser) {
    syncedUser.uid = user.uid;
    syncedUser.provider = user.provider;
    syncedUser.provider_uid = user.id;
    syncedUser.display_name = user.displayName;

    syncedUser.$save().then(function() {
      return _postUpdate(syncedUser);
    }, function(error) {
      $log.error('error in _createNewUser', error);
    });
  };

  var _updateExistingUser = function(user, syncedUser) {
    syncedUser.display_name = user.displayName;
    syncedUser.$save().then(function() {
      return _postUpdate(syncedUser);
    }, function(error) {
      $log.error('error in _updateExistingUser', error);
    });
  };

  var _postUpdate = function(syncedUser) {
    return $q.all([
      FamilyService.updateUser(syncedUser).then(function() {

      }, function(error) {
        $log.error(error);
      }),
      GoalService.updateUser(syncedUser).then(function() {

      }, function(error) {
        $log.error(error);
      })
    ]);
  };
  
}]);
