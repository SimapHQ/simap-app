'use strict';

var app = angular.module('simapApp');

app.service('LoginService', [
  '$firebaseSimpleLogin',
  '$log',
  'FirebaseService',
  function(
    $firebaseSimpleLogin,
    $log,
    FirebaseService
    ) {

  var authClient = $firebaseSimpleLogin(FirebaseService.getRef());

  this.login = function(provider) {
    authClient.$login(provider).then(undefined, function(error) {
      $log.error(error);
    });
  };

  this.logout = function() {
    authClient.$logout();
  };

}]);
