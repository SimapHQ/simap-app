'use strict';

describe('Controller: LoginCtrl', function() {

  var LoginCtrl,
      $scope,
      $location,
      $log,
      AuthService;

  beforeEach(function() {
    module('mock.firebase');
    module('simapApp');
  });

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    $location = jasmine.createSpyObj('$location', ['path']);
    AuthService = jasmine.createSpyObj('AuthService', ['login', 'logout', 'isLoggedIn']);

    LoginCtrl = $controller('LoginCtrl', {
      $scope: $scope,
      $location: $location,
      $log: $log,
      AuthService: AuthService
    });
  }));

  it('should call AuthService.logout when logout is called', function () {
    $scope.logout();

    expect(AuthService.logout).toHaveBeenCalled();
  });

  it('should redirect to / when logout is called', function() {
    $scope.logout();

    expect($location.path).toHaveBeenCalledWith('/');
  });

  it('should use the right provider when logging in', function() {
    $scope.loginGoogle();
    
    expect(AuthService.login).toHaveBeenCalledWith('google');
  });

  it('should use the AuthService to know if a user is logged in', function() {
    $scope.isLoggedIn();

    expect(AuthService.isLoggedIn).toHaveBeenCalled();
  });
  
});
