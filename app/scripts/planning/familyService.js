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
  'SessionService',
  'USER_NODE',
  function(
    $firebase,
    $log,
    DEFAULT_FAMILY_SIZE_ADULTS,
    DEFAULT_FAMILY_SIZE_CHILDREN,
    FAMILY_NODE,
    FirebaseService,
    GuidService,
    SessionService,
    USER_NODE
  ) {

  var syncedFamily;

  this.updateUsersFamily = function(uid) {
    var syncedUser = FirebaseService.getObject(USER_NODE + uid);
    return syncedUser.$loaded().then(function() {
      if (syncedUser.familyId === undefined || syncedUser.familyId === null) {
        return _createNewFamily(syncedUser);
      } else {
        return _updateExistingFamily(syncedUser);
      }
    }).finally(function() {
      syncedUser.$destroy();
    });
  };

  this.getFamily = function() {
    if (syncedFamily === undefined) {
      syncedFamily = FirebaseService.getObject(FAMILY_NODE + SessionService.currentSession('familyId'));
    }

    return syncedFamily;
  };

  var _createNewFamily = function(syncedUser) {
    var newFamilyId = GuidService.generateGuid();
    syncedFamily = FirebaseService.getObject(FAMILY_NODE + newFamilyId);

    return syncedFamily.$loaded().then(function() {
      syncedFamily.owner = syncedUser.uid;
      syncedFamily.adults = DEFAULT_FAMILY_SIZE_ADULTS;
      syncedFamily.children = DEFAULT_FAMILY_SIZE_CHILDREN;

      return syncedFamily.$save().then(function() {
        syncedUser.familyId = newFamilyId;
        return syncedUser.$save();
      });
    });
  };

  var _updateExistingFamily = function(syncedUser) {
    syncedFamily = FirebaseService.getObject(FAMILY_NODE + syncedUser.familyId);

    return syncedFamily.$loaded().then(function() {
      // Update family schema as necessary
      return syncedFamily.$save();
    });
  };
}]);
