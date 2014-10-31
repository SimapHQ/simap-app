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

  var isBindableType = function(type) {
    return type === 'categories' || type === 'items';
  };

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

  this.bindToUser = function(type, id) {
    if (!isBindableType(type)) {
      $log.error('bindToUser cannot bind %s', type);
      return;
    }

    if (syncedUser[type] === undefined || syncedUser[type] === null) {
      syncedUser[type] = {};
    }

    syncedUser[type][id] = true;

    return syncedUser.$save().then(function() {
      return id;
    });
  };

  this.unbindFromUser = function(type, id) {
    if (!isBindableType(type)) {
      $log.error('unbindFromUser cannot unbind %s', type);
      return;
    }

    if (syncedUser[type] === undefined || syncedUser[type] === null) {
      $log.error('unbindFromUser id %s was not bound to user', id);
      return null;
    }

    // TODO: Make sure the thing that is being unbound doesn't exist?
    syncedUser[type][id] = null;

    return syncedUser.$save();
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
