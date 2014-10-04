'use strict';

var app = angular.module('simapApp');

app.service('AuthService', ['$location', '$log', '$firebase', '$firebaseSimpleLogin', '$q', 'FIREBASE_URL', function($location, $log, $firebase, $firebaseSimpleLogin, $q, FIREBASE_URL) {
  var firebaseRef = new Firebase(FIREBASE_URL);

  var authClient = $firebaseSimpleLogin(firebaseRef);

  var currentUser = null;

  this.login = function(provider) {
    authClient.$login(provider).then(finishLogin, handleError);
  };

  this.logout = function() {
    $log.debug('logging out...');
    currentUser = null;
    authClient.$logout();
  };

  var finishLogin = function(user) {
    if (user) {
      currentUser = user;
      $log.debug('user logged in.', user);

      firebaseRef.child('users').child(user.uid).update({
        provider: user.provider,
        provider_uid: user.id,
        displayName: user.displayName
      });

      $location.path('/home');
    } else {
      currentUser = null;
      $log.error('finishLogin called with bad user.', user);
    }
  };

  var handleError = function(error) {
    if (error) {
      $log.error('login error.', error);
    } else {
      $log.error('handleError called with bad error.', error);
    }
  };

  this.getCurrentUser = function() {
    return authClient.$getCurrentUser().then(function(user) {
      if (user) {
        currentUser = user;
        $log.debug('got current user.', user);
        return user;
      } else {
        currentUser = null;
        $log.debug('no user currently logged in.', user);
        return $q.reject(user);
      }
    }, function(error) {
      currentUser = null;
      $log.error('failed to get current user.', error);
      return $q.reject(error);
    });
  };
  
  this.isLoggedIn = function() {
    return currentUser !== null;
  };

}]);
