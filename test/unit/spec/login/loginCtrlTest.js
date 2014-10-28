'use strict';

describe('Controller: LoginCtrl', function() {

  var LoginCtrl,
      $scope,
      $location,
      $log,
      LoginService,
      SessionService;

  beforeEach(function() {
    module('mock.firebase');
    module('simapApp');
  });

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    $location = jasmine.createSpyObj('$location', ['path']);
    LoginService = jasmine.createSpyObj('LoginService', ['login', 'logout']);
    SessionService = jasmine.createSpyObj('SessionService', ['currentSession']);

    LoginCtrl = $controller('LoginCtrl', {
      $scope: $scope,
      $location: $location,
      $log: $log,
      LoginService: LoginService,
      SessionService: SessionService
    });
  }));

  it('should call LoginService.logout when logout is called', function () {
    $scope.logout();

    expect(LoginService.logout).toHaveBeenCalled();
  });

  it('should redirect to / when logout is called', function() {
    $scope.logout();

    expect($location.path).toHaveBeenCalledWith('/');
  });

  it('should use the right provider when logging in with google', function() {
    $scope.loginGoogle();

    expect(LoginService.login).toHaveBeenCalledWith('google');
  });

  it('should use the right provider when logging in with facebook', function() {
    $scope.loginFacebook();

    expect(LoginService.login).toHaveBeenCalledWith('facebook');
  });

  it('should use the right provider when logging in with twitter', function() {
    $scope.loginTwitter();

    expect(LoginService.login).toHaveBeenCalledWith('twitter');
  });

  it('should use the right provider when logging in with github', function() {
    $scope.loginGitHub();

    expect(LoginService.login).toHaveBeenCalledWith('github');
  });

  it('should use the SessionService to know if a user is logged in', function() {
    $scope.isLoggedIn();

    expect(SessionService.currentSession).toHaveBeenCalled();
  });

});
