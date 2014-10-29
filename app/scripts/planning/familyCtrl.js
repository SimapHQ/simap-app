'use strict';

angular.module('simapApp').controller('FamilyCtrl', [
  '$firebase',
  '$scope',
  'FirebaseService',
  'FAMILY_NODE',
  'SessionService',
  function (
    $firebase,
    $scope,
    FirebaseService,
    FAMILY_NODE,
    SessionService
    ) {

    var ref = FirebaseService.getRef(),
        family_id = SessionService.currentSession().family_id;

    $firebase(ref.child(FAMILY_NODE + family_id + '/adults')).$asObject().$bindTo($scope, 'adults');
    $firebase(ref.child(FAMILY_NODE + family_id + '/children')).$asObject().$bindTo($scope, 'children');
}]);
