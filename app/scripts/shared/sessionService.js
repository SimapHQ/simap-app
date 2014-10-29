'use strict';

var app = angular.module('simapApp');

app.service('SessionService', ['$log',
                               '$location',
                               '$firebase',
                               'FirebaseService',
                               'USER_NODE',
                               'HOME',
  function($log, $location, $firebase, FirebaseService, USER_NODE, HOME) {

  var syncedUser = null;

  var _closeSession = function() {
    $log.debug('closing session');
    if (syncedUser !== null) {
      syncedUser.$destroy();
      syncedUser = null;
    }
  };

  this.currentSession = function() {
    return syncedUser;
  };

  this.startSession = function(user) {
    $log.debug('starting session', user);

    var userNode = FirebaseService.getRef().child(USER_NODE + user.uid);
    syncedUser = $firebase(userNode).$asObject();
    return syncedUser.$loaded().then(function(data) {
      $log.debug('started session', data);
      $location.path(HOME);
    }, function(error) {
      $log.error('error starting session', error);
      _closeSession();
    });
  };

  this.closeSession = _closeSession;

}]);
