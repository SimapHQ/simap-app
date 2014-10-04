'use strict';

angular.module('simapApp').controller('LoginCtrl', ['$scope', '$location', '$log', 'AuthService', function ($scope, $location, $log, AuthService) {

  $scope.testValue = 5;

  $scope.logout = function() {
    AuthService.logout();
    $location.path('/');
  };

  $scope.loginGoogle = function() {
    AuthService.login('google');
  };

  $scope.loginFacebook = function() {
    AuthService.login('facebook');
  };

  $scope.loginTwitter = function() {
    AuthService.login('twitter');
  };

  $scope.loginGitHub = function() {
    AuthService.login('github');
  };

  $scope.isLoggedIn = function() {
    return AuthService.isLoggedIn();
  };

}]);
