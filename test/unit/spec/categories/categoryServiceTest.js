'use strict';

describe('Service: CategoryService', function() {

  var mockSession,
      syncedCategory,
      mockFirebaseRef,
      $firebaseObj,
      $rootScope,
      deferredLoaded,
      deferredSave,
      deferredRemove;

  var CategoryService,
      $firebase,
      FirebaseService,
      GuidService,
      randomColor,
      SessionService;

  beforeEach(function() {
    module('simapApp');
  });

  beforeEach(module('simapApp', function($provide) {
    mockSession = {
      uid: 'user-id',
      categories: {
        cid1: true
      }
    };

    syncedCategory = jasmine.createSpyObj('syncedCategory', ['$loaded', '$save', '$destroy']);

    $firebaseObj = jasmine.createSpyObj('$firebaseObj', ['$asObject', '$remove']);
    $firebaseObj.$asObject.and.returnValue(syncedCategory);

    $firebase = jasmine.createSpy('$firebase');
    $firebase.and.returnValue($firebaseObj);

    mockFirebaseRef = jasmine.createSpyObj('mockFirebaseRef', ['child']);
    mockFirebaseRef.child.and.callFake(function() { return $firebaseObj });
    FirebaseService = jasmine.createSpyObj('FirebaseService', ['getRef']);
    FirebaseService.getRef.and.callFake(function() { return mockFirebaseRef; });

    GuidService = jasmine.createSpyObj('GuidService', ['generateGuid']);
    GuidService.generateGuid.and.returnValue('generated-guid');

    randomColor = jasmine.createSpy('randomColor').and.returnValue('#fafafa');

    SessionService = jasmine.createSpyObj('SessionService', ['currentSession', 'bindToUser', 'unbindFromUser']);
    SessionService.currentSession.and.returnValue(mockSession);

    $provide.value('$firebase', $firebase);
    $provide.value('FirebaseService', FirebaseService);
    $provide.value('GuidService', GuidService);
    $provide.value('randomColor', randomColor);
    $provide.value('SessionService', SessionService);
  }));

  beforeEach(inject(function (_CategoryService_, $q, _$rootScope_) {
    CategoryService = _CategoryService_;
    $rootScope = _$rootScope_;

    deferredLoaded = $q.defer();
    syncedCategory.$loaded.and.returnValue(deferredLoaded.promise);
    deferredLoaded.resolve();

    deferredSave = $q.defer();
    syncedCategory.$save.and.returnValue(deferredSave.promise);
    deferredSave.resolve();

    deferredRemove = $q.defer();
    $firebaseObj.$remove.and.returnValue(deferredRemove.promise);
    deferredRemove.resolve();
  }));

  describe('createNew', function() {
    it('should get a reference to a category using the generated id', function() {
      CategoryService.createNew();

      expect(mockFirebaseRef.child).toHaveBeenCalledWith('category/generated-guid');
    });

    it('should call $asObject on the $firebase reference', function() {
      CategoryService.createNew();

      expect($firebaseObj.$asObject).toHaveBeenCalled();
    });

    it('should invoke randomColor to set the category color', function() {
      CategoryService.createNew();
      $rootScope.$digest();

      expect(randomColor).toHaveBeenCalled();
    });

    it('should set the properties on the new category', function() {
      CategoryService.createNew();
      $rootScope.$digest();

      expect(syncedCategory.owner).toBe('user-id');
      expect(syncedCategory.name).toBe('New Category Name');
      expect(syncedCategory.color).toBe('#fafafa');
    });

    it('should save the new category object', function() {
      CategoryService.createNew();
      $rootScope.$digest();

      expect(syncedCategory.$save).toHaveBeenCalled();
    });

    it('should use the SessionService to bind the new category to the current user', function() {
      CategoryService.createNew();
      $rootScope.$digest();

      expect(SessionService.bindToUser).toHaveBeenCalledWith('categories', 'generated-guid');
    });

    it('should $destroy the object when done', function() {
      CategoryService.createNew();
      $rootScope.$digest();

      expect(syncedCategory.$destroy).toHaveBeenCalled();
    });
  });

  describe('removeOld', function() {
    it('should bail if the specifed category isn\'t bound to the user', function() {
      CategoryService.removeOld('cid2');

      expect(SessionService.unbindFromUser).not.toHaveBeenCalled();
    });

    it('should reference the right node', function() {
      CategoryService.removeOld('cid1');

      expect(mockFirebaseRef.child).toHaveBeenCalledWith('category/cid1');
    });

    it('should call remove on the node', function() {
      CategoryService.removeOld('cid1');

      expect($firebaseObj.$remove).toHaveBeenCalled();
    });

    it('should call unbindFromUser after removing the node', function() {
      CategoryService.removeOld('cid1');
      $rootScope.$digest();

      expect(SessionService.unbindFromUser).toHaveBeenCalledWith('categories', 'cid1');
    });
  });

});
