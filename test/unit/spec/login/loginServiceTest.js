'use strict';

describe('Service: LoginService', function() {

  var mockAuthClient,
      mockFirebaseRef,
      mockUser,
      mockProvider,
      $rootScope,
      deferredLogin,
      deferredUpdateUser;

  // Injected dependencies
  var LoginService,
      $location,
      $log,
      $firebaseSimpleLogin,
      FirebaseService,
      UserService;

  beforeEach(function() {
    module('simapApp');
  });

  beforeEach(module('simapApp', function($provide) {
    mockUser = { uid: 'test:123' };
    mockProvider = 'some-auth-provider';

    mockAuthClient = jasmine.createSpyObj('mockAuthClient', ['$login', '$logout']);
    $firebaseSimpleLogin = jasmine.createSpy('$firebaseSimpleLogin').and.returnValue(mockAuthClient);

    mockFirebaseRef = jasmine.createSpy('mockFirebaseRef');
    FirebaseService = jasmine.createSpyObj('FirebaseService', ['getRef']);
    FirebaseService.getRef.and.callFake(function() { return mockFirebaseRef; });

    UserService = jasmine.createSpyObj('UserService', ['updateUser']);

    $log = jasmine.createSpyObj('$log', ['debug', 'error']);
    $location = jasmine.createSpyObj('$location', ['path']);

    $provide.value('$log', $log);
    $provide.value('$location', $location);
    $provide.value('$firebaseSimpleLogin', $firebaseSimpleLogin);
    $provide.value('FirebaseService', FirebaseService);
    $provide.value('UserService', UserService);
  }));

  beforeEach(inject(function (_LoginService_, $q, _$rootScope_) {
    LoginService = _LoginService_;
    $rootScope = _$rootScope_;

    deferredLogin = $q.defer();
    mockAuthClient.$login.and.callFake(function() { return deferredLogin.promise; });

    deferredUpdateUser = $q.defer();
    UserService.updateUser.and.callFake(function() { return deferredUpdateUser.promise });
  }));

  describe('login', function() {
    it('should call $login on the authClient with the appropriate provider', function() {
      LoginService.login(mockProvider);

      expect(mockAuthClient.$login).toHaveBeenCalledWith(mockProvider);
    });

    it('should log the error if $login failed', function() {
      deferredLogin.reject('error-msg');
      LoginService.login(mockProvider);

      $rootScope.$digest();

      expect($log.error).toHaveBeenCalledWith('error-msg');
    });

    it('should log an error if the user logged in, but we didn\'t get their data', function() {
      deferredLogin.resolve(null);
      LoginService.login(mockProvider);

      $rootScope.$digest();

      expect($log.error).toHaveBeenCalledWith('finishLogin called with bad user', null);
    });

    it('should use the UserService to update the authenticated user', function() {
      LoginService.login(mockProvider);
      deferredLogin.resolve(mockUser);
      deferredUpdateUser.resolve(mockUser);
      $rootScope.$digest();

      expect(UserService.updateUser).toHaveBeenCalledWith(mockUser);
    });

    it('should redirect the user to /home after logging in', function() {
      LoginService.login(mockProvider);
      deferredLogin.resolve(mockUser);
      deferredUpdateUser.resolve(mockUser);
      $rootScope.$digest();

      expect($location.path).toHaveBeenCalledWith('/home');
    });

    it('should logout the user if there was an error updating their information', function() {
      LoginService.login(mockProvider);
      deferredLogin.resolve(mockUser);
      deferredUpdateUser.reject('some error occurred');
      $rootScope.$digest();

      expect(mockAuthClient.$logout).toHaveBeenCalled();
    });
  });

  describe('logout', function() {
    it('should call $logout on the authClient', function() {
      LoginService.logout();

      expect(mockAuthClient.$logout).toHaveBeenCalled();
    });
  });

});
