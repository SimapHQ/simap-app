'use strict';

angular.module('simapApp').controller('LoginCtrl', ['$scope', '$location', '$log', 'LoginService', 'SessionService', 
  function ($scope, $location, $log, LoginService, SessionService) {

  $scope.testValue = 5;

  $scope.logout = function() {
    LoginService.logout();
    $location.path('/');
  };

  $scope.loginGoogle = function() {
    LoginService.login('google');
  };

  $scope.loginFacebook = function() {
    LoginService.login('facebook');
  };

  $scope.loginTwitter = function() {
    LoginService.login('twitter');
  };

  $scope.loginGitHub = function() {
    LoginService.login('github');
  };

  $scope.isLoggedIn = function() {
    return SessionService.currentSession() !== null;
  };

}]);
