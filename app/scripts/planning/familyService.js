'use strict';

var app = angular.module('simapApp');

app.service('FamilyService', [
  '$firebase',
  '$log',
  'DEFAULT_FAMILY_SIZE_ADULTS',
  'DEFAULT_FAMILY_SIZE_CHILDREN',
  'FAMILY_NODE',
  'FirebaseService',
  'GuidService',
  'USER_NODE',
  function(
    $firebase,
    $log,
    DEFAULT_FAMILY_SIZE_ADULTS,
    DEFAULT_FAMILY_SIZE_CHILDREN,
    FAMILY_NODE,
    FirebaseService,
    GuidService,
    USER_NODE
  ) {
  var firebaseRef = FirebaseService.getRef();

  this.updateUser = function(uid) {
    var syncedUser = $firebase(firebaseRef.child(USER_NODE + uid)).$asObject();
    return syncedUser.$loaded().then(function() {
      if (syncedUser.family_id === undefined || syncedUser.family_id === null) {
        return _createNewFamily(syncedUser);
      } else {
        return _updateExistingFamily(syncedUser);
      }
    }).finally(function() {
      syncedUser.$destroy();
    });
  };

  var _createNewFamily = function(syncedUser) {
    var newFamilyId = GuidService.generateGuid();
    var syncedFamily = $firebase(firebaseRef.child(FAMILY_NODE + newFamilyId)).$asObject();

    return syncedFamily.$loaded().then(function() {
      syncedFamily.owner = syncedUser.uid;
      syncedFamily.adults = DEFAULT_FAMILY_SIZE_ADULTS;
      syncedFamily.children = DEFAULT_FAMILY_SIZE_CHILDREN;

      return syncedFamily.$save().then(function() {
        syncedUser.family_id = newFamilyId;
        return syncedUser.$save();
      });
    }).finally(function() {
      syncedFamily.$destroy();
    });
  };

  var _updateExistingFamily = function(syncedUser) {
    var syncedFamily = $firebase(firebaseRef.child(FAMILY_NODE + syncedUser.family_id)).$asObject();

    return syncedFamily.$loaded().then(function() {
      // Update family schema as necessary
      return syncedFamily.$save();
    }).finally(function() {
      syncedFamily.$destroy();
    });
  };
}]);
