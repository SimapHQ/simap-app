'use strict';

describe('Service: FamilyService', function() {

  var mockUid,
      mockSyncedUser,
      mockFamilyId,
      mockSyncedFamily,
      $firebaseUserObj,
      $firebaseFamilyObj,
      mockFirebaseRef,
      $rootScope,
      deferredUserLoaded,
      deferredUserSave,
      deferredFamilyLoaded,
      deferredFamilySave;

  var FamilyService,
      $firebase,
      $log,
      FirebaseService,
      GoalService,
      GuidService;

  beforeEach(function() {
    module('simapApp');
  });

  beforeEach(module('simapApp', function($provide) {
    mockUid = 'test:123';
    mockFamilyId = 'l3klkf2lkfe2lk';

    mockSyncedUser = jasmine.createSpyObj('mockSyncedUser', ['$loaded', '$save', '$destroy']);
    mockSyncedUser.uid = mockUid;

    mockSyncedFamily = jasmine.createSpyObj('mockSyncedFamily', ['$loaded', '$save', '$destroy']);

    $firebaseUserObj = jasmine.createSpyObj('$firebaseUserObj', ['$asObject'])
    $firebaseUserObj.$asObject.and.returnValue(mockSyncedUser);

    $firebaseFamilyObj = jasmine.createSpyObj('$firebaseFamilyObj', ['$asObject'])
    $firebaseFamilyObj.$asObject.and.returnValue(mockSyncedFamily);

    $firebase = jasmine.createSpy('$firebase').and.callFake(function(ref) {
      if (ref == 'user/' + mockUid) {
        return $firebaseUserObj
      } else if (ref == 'family/' + mockFamilyId) {
        return $firebaseFamilyObj;
      }
    });

    mockFirebaseRef = jasmine.createSpyObj('mockFirebaseRef', ['child']);
    mockFirebaseRef.child.and.callFake(function(node) { return node });

    FirebaseService = jasmine.createSpyObj('FirebaseService', ['getRef']);
    FirebaseService.getRef.and.returnValue(mockFirebaseRef);

    GuidService = jasmine.createSpyObj('GuidService', ['generateGuid']);
    GuidService.generateGuid.and.returnValue(mockFamilyId);

    $log = jasmine.createSpyObj('$log', ['debug', 'error']);

    $provide.value('$firebase', $firebase);
    $provide.value('$log', $log);
    $provide.value('FirebaseService', FirebaseService);
    $provide.value('GuidService', GuidService);
  }));

  beforeEach(inject(function (_FamilyService_, $q, _$rootScope_) {
    FamilyService = _FamilyService_;
    $rootScope = _$rootScope_;

    deferredUserLoaded = $q.defer();
    mockSyncedUser.$loaded.and.returnValue(deferredUserLoaded.promise);

    deferredUserSave = $q.defer();
    mockSyncedUser.$save.and.returnValue(deferredUserSave.promise);

    deferredFamilyLoaded = $q.defer();
    mockSyncedFamily.$loaded.and.returnValue(deferredFamilyLoaded.promise);

    deferredFamilySave = $q.defer();
    mockSyncedFamily.$save.and.returnValue(deferredFamilySave.promise);
  }));

  describe('updateUser', function() {
    it('should use the appropriate user node', function() {
      FamilyService.updateUser(mockUid);

      expect(mockFirebaseRef.child).toHaveBeenCalledWith('user/test:123');
    });

    it('should call $asObject on the firebase object', function() {
      FamilyService.updateUser(mockUid);

      expect($firebaseUserObj.$asObject).toHaveBeenCalled();
    });

    it('should load the user', function() {
      FamilyService.updateUser(mockUid);

      expect(mockSyncedUser.$loaded).toHaveBeenCalled();
    });

    it('should call $destroy on the user', function() {
      FamilyService.updateUser(mockUid);
      deferredUserLoaded.reject();
      $rootScope.$digest();

      expect(mockSyncedUser.$destroy).toHaveBeenCalled();
    });

    describe('_createNewFamily', function() {
      beforeEach(function() {
        mockSyncedUser.family_id = undefined;
      });

      it('should create a new family id', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        $rootScope.$digest();

        expect(GuidService.generateGuid).toHaveBeenCalled();
      });

      it('should use the generated id to reference the family node', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        $rootScope.$digest();

        expect(mockFirebaseRef.child).toHaveBeenCalledWith('family/' + mockFamilyId);
      });

      it('should create a firebase object for that family node', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        $rootScope.$digest();

        expect($firebase).toHaveBeenCalledWith('family/' + mockFamilyId);
      });

      it('should call $asObject on that object', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        $rootScope.$digest();

        expect($firebaseFamilyObj.$asObject).toHaveBeenCalled();
      });

      it('should wait for the new family object to laod', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        $rootScope.$digest();

        expect(mockSyncedFamily.$loaded).toHaveBeenCalled();
      });

      it('should put the right data in the new family', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        $rootScope.$digest();

        expect(mockSyncedFamily.owner).toBe(mockUid);
        expect(mockSyncedFamily.adults).toBe(1);
        expect(mockSyncedFamily.children).toBe(0);
      });

      it('should save the new family', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        $rootScope.$digest();

        expect(mockSyncedFamily.$save).toHaveBeenCalled();
      });

      it('should set the user\'s family_id to the new family\'s id', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        deferredFamilySave.resolve();
        $rootScope.$digest();

        expect(mockSyncedUser.family_id).toBe(mockFamilyId);
      });

      it('should save the updated user', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        deferredFamilySave.resolve();
        $rootScope.$digest();

        expect(mockSyncedUser.$save).toHaveBeenCalled();
      });

      it('should destroy the synced family object', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        deferredFamilySave.resolve();
        deferredUserSave.resolve();
        $rootScope.$digest();

        expect(mockSyncedFamily.$destroy).toHaveBeenCalled();
      });
    });

    describe('_updateExistingFamily', function() {
      beforeEach(function() {
        mockSyncedUser.family_id = mockFamilyId;
      });

      it('should create a firebase object for that user\'s family node', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        $rootScope.$digest();

        expect($firebase).toHaveBeenCalledWith('family/' + mockFamilyId);
      });

      it('should call $asObject on that object', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        $rootScope.$digest();

        expect($firebaseFamilyObj.$asObject).toHaveBeenCalled();
      });

      it('should wait for the new family object to laod', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        $rootScope.$digest();

        expect(mockSyncedFamily.$loaded).toHaveBeenCalled();
      });

      it('should save the updated family', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        $rootScope.$digest();

        expect(mockSyncedFamily.$save).toHaveBeenCalled();
      });

      it('should destroy the synced family object', function() {
        FamilyService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredFamilyLoaded.resolve();
        deferredFamilySave.resolve();
        $rootScope.$digest();

        expect(mockSyncedFamily.$destroy).toHaveBeenCalled();
      });
    });

  });

});
