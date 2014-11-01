'use strict';

describe('Service: SessionService', function() {

  var user,
      $firebaseObj,
      firebaseRef,
      syncedUser,
      mockUserNode,
      $rootScope,
      deferredLoaded,
      deferredSave;

  // Injected dependencies
  var SessionService,
      $log,
      $location,
      $firebase,
      FirebaseService;

  beforeEach(function() {
    module('simapApp');
  });

  beforeEach(module('simapApp', function($provide) {
    user = {
      uid: 'test:123'
    };

    mockUserNode = 'mock-user-node';

    $log = jasmine.createSpyObj('$log', ['debug', 'error']);
    $location = jasmine.createSpyObj('$location', ['path']);

    syncedUser = jasmine.createSpyObj('syncedUser', ['$loaded', '$save', '$destroy']);
    $firebaseObj = jasmine.createSpyObj('$firebaseObj', ['$asObject'])
    $firebaseObj.$asObject.and.callFake(function() { return syncedUser; });
    $firebase = jasmine.createSpy('$firebase').and.returnValue($firebaseObj);

    firebaseRef = jasmine.createSpyObj('firebaseRef', ['child']);
    firebaseRef.child.and.callFake(function() { return mockUserNode; });
    FirebaseService = jasmine.createSpyObj('FirebaseService', ['getRef']);
    FirebaseService.getRef.and.callFake(function() { return firebaseRef; });

    $provide.value('$log', $log);
    $provide.value('$location', $location);
    $provide.value('$firebase', $firebase);
    $provide.value('FirebaseService', FirebaseService);
  }));

  beforeEach(inject(function (_SessionService_, _$rootScope_, $q) {
    SessionService = _SessionService_;
    $rootScope = _$rootScope_;

    deferredLoaded = $q.defer();
    syncedUser.$loaded.and.returnValue(deferredLoaded.promise);

    deferredSave = $q.defer();
    syncedUser.$save.and.returnValue(deferredSave.promise);
  }));

  it('should have a null session to start with', function() {
    expect(SessionService.currentSession()).toBeNull();
  });

  describe('startSession', function() {
    it('should use the correct user node', function() {
      SessionService.startSession(user);

      expect(firebaseRef.child).toHaveBeenCalledWith('user/' + user.uid);
    });

    it('should create a new $firebase reference to the user', function() {
      SessionService.startSession(user);

      expect($firebase).toHaveBeenCalledWith(mockUserNode);
    });

    it('should call $asObject on the reference', function() {
      SessionService.startSession(user);

      expect($firebaseObj.$asObject).toHaveBeenCalled();
    });

    it('should redirect the user to /home once the user has been loaded', function() {
      SessionService.startSession(user);
      deferredLoaded.resolve();
      $rootScope.$digest();

      expect($location.path).toHaveBeenCalledWith('/home');
    });

    it('should close the session if an error occurred', function() {
      SessionService.startSession(user);
      deferredLoaded.reject();
      $rootScope.$digest();

      expect(syncedUser.$destroy).toHaveBeenCalled();
    });
  });

  describe('closeSession', function() {
    it('should call $destroy on the syncedUser object', function() {
      SessionService.startSession(user);
      SessionService.closeSession();

      expect(syncedUser.$destroy).toHaveBeenCalled();
    });

    it('should not try to call $destroy on a null syncedUser object', function() {
      SessionService.closeSession();

      expect(syncedUser.$destroy).not.toHaveBeenCalled();
    });
  });

  describe('bindToUser', function() {
    beforeEach(function() {
      SessionService.startSession(user);
      syncedUser.categories = {};
    });

    it('should log an error and bail if the type isn\'t a bindable type', function() {
      SessionService.bindToUser('an-invalid-type', 'some-id');

      expect($log.error).toHaveBeenCalledWith('bindToUser cannot bind %s', 'an-invalid-type');
    });

    it('should do the binding', function() {
      SessionService.bindToUser('categories', 'someCategoryId');

      expect(syncedUser.categories.someCategoryId).toBe(true);
    });

    it('should handle uninitialized type lists in the session', function() {
      syncedUser.categories = null;
      SessionService.bindToUser('categories', 'someCategoryId');

      expect(syncedUser.categories.someCategoryId).toBe(true);
    });

    it('should save the user with the new binding', function() {
      SessionService.bindToUser('categories', 'anotherCategoryId');

      expect(syncedUser.$save).toHaveBeenCalled();
    });

    it('should return a promise containing the newly bound id', function(done) {
      var bindResult = SessionService.bindToUser('categories', 'anotherCategoryId');
      deferredSave.resolve();

      bindResult.then(function(boundId) {
        expect(boundId).toBe('anotherCategoryId');
        done();
      });

      $rootScope.$digest();
    });
  });

  describe('unbindFromUser', function() {
    beforeEach(function() {
      SessionService.startSession(user);
      SessionService.bindToUser('categories', 'realCategoryId');
    });

    it('should log an error and bail if the type isn\'t a bindable type', function() {
      SessionService.unbindFromUser('an-invalid-type', 'some-id');

      expect($log.error).toHaveBeenCalledWith('unbindFromUser cannot unbind %s', 'an-invalid-type');
    });

    it('should do the unbinding', function() {
      SessionService.unbindFromUser('categories', 'realCategoryId');

      expect(syncedUser.categories.realCategoryId).toBe(null);
    });

    it('should log an error and bail if the binding didn\'t exist', function() {
      SessionService.unbindFromUser('categories', 'someCategoryId');

      expect($log.error).toHaveBeenCalledWith('unbindFromUser id %s was not bound to user', 'someCategoryId');
    });

    it('should save the user with the new binding list', function() {
      SessionService.unbindFromUser('categories', 'realCategoryId');

      expect(syncedUser.$save).toHaveBeenCalled();
    });
  });

});
