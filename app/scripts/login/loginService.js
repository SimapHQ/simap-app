'use strict';

var app = angular.module('simapApp');

app.service('LoginService', ['$location', 
                             '$log', 
                             '$firebaseSimpleLogin', 
                             'FirebaseService', 
                             'UserService', 
                             'USER_NODE',
                             'HOME',
  function($location, $log, $firebaseSimpleLogin, FirebaseService, UserService, USER_NODE, HOME) {
  
  var authClient = $firebaseSimpleLogin(FirebaseService.getRef());

  this.login = function(provider) {
    authClient.$login(provider).then(finishLogin, handleError);
  };

  this.logout = function() {
    $log.debug('logging out...');
    authClient.$logout();
  };

  var finishLogin = function(user) {
    if (user) {
      $log.debug('user logged in.', user);
      UserService.updateUser(user).then(function(updatedUser) {
        $log.debug('updated user', updatedUser);
        $location.path(HOME);
      }, function(error) {
        $log.error('error updating user', user, error);
        authClient.$logout(); 
      });
    } else {
      $log.error('finishLogin called with bad user', user);
    }
  };

  var handleError = function(error) {
    if (error) {
      $log.error('login error.', error);
    } else {
      $log.error('handleError called with bad error', error);
    }
  };
  
}]);
