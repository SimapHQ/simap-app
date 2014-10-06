'use strict';

describe('Service: AuthService', function() {

  var AuthService,
      $scope,
      $location,
      $log,
      AuthService;

  beforeEach(function() {
    module('mock.firebase');
    module('simapApp');
  });

  beforeEach(inject(function (AuthService) {
    AuthService = AuthService;
  }));

  it('should do stuff', function() {

  });
  
});
