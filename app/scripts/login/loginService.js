'use strict';

var app = angular.module('simapApp');

app.service('LoginService', [
  '$firebaseSimpleLogin',
  '$location',
  '$log',
  'FirebaseService',
  'UserService',
  function(
    $firebaseSimpleLogin,
    $location,
    $log,
    FirebaseService,
    UserService
    ) {

  var authClient = $firebaseSimpleLogin(FirebaseService.getRef());

  this.login = function(provider) {
    authClient.$login(provider).then(finishLogin, function(error) {
      $log.error(error);
    });
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
      }, function(error) {
        $log.error('error updating user', user, error);
        authClient.$logout();
      });
    } else {
      $log.error('finishLogin called with bad user', user);
    }
  };

}]);
