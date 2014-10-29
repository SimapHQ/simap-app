'use strict';

describe('Service: GoalService', function() {

  var mockUid,
      mockSyncedUser,
      mockGoalId,
      mockSyncedGoal,
      $firebaseUserObj,
      $firebaseGoalObj,
      mockFirebaseRef,
      $rootScope,
      deferredUserLoaded,
      deferredUserSave,
      deferredGoalLoaded,
      deferredGoalSave;

  var GoalService,
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
    mockGoalId = 'l3klkf2lkfe2lk';

    mockSyncedUser = jasmine.createSpyObj('mockSyncedUser', ['$loaded', '$save', '$destroy']);
    mockSyncedUser.uid = mockUid;

    mockSyncedGoal = jasmine.createSpyObj('mockSyncedGoal', ['$loaded', '$save', '$destroy']);

    $firebaseUserObj = jasmine.createSpyObj('$firebaseUserObj', ['$asObject'])
    $firebaseUserObj.$asObject.and.returnValue(mockSyncedUser);

    $firebaseGoalObj = jasmine.createSpyObj('$firebaseGoalObj', ['$asObject'])
    $firebaseGoalObj.$asObject.and.returnValue(mockSyncedGoal);

    $firebase = jasmine.createSpy('$firebase').and.callFake(function(ref) {
      if (ref == 'user/' + mockUid) {
        return $firebaseUserObj
      } else if (ref == 'goal/' + mockGoalId) {
        return $firebaseGoalObj;
      }
    });

    mockFirebaseRef = jasmine.createSpyObj('mockFirebaseRef', ['child']);
    mockFirebaseRef.child.and.callFake(function(node) { return node });

    FirebaseService = jasmine.createSpyObj('FirebaseService', ['getRef']);
    FirebaseService.getRef.and.returnValue(mockFirebaseRef);

    GuidService = jasmine.createSpyObj('GuidService', ['generateGuid']);
    GuidService.generateGuid.and.returnValue(mockGoalId);

    $log = jasmine.createSpyObj('$log', ['debug', 'error']);

    $provide.value('$firebase', $firebase);
    $provide.value('$log', $log);
    $provide.value('FirebaseService', FirebaseService);
    $provide.value('GuidService', GuidService);
  }));

  beforeEach(inject(function (_GoalService_, $q, _$rootScope_) {
    GoalService = _GoalService_;
    $rootScope = _$rootScope_;

    deferredUserLoaded = $q.defer();
    mockSyncedUser.$loaded.and.returnValue(deferredUserLoaded.promise);

    deferredUserSave = $q.defer();
    mockSyncedUser.$save.and.returnValue(deferredUserSave.promise);

    deferredGoalLoaded = $q.defer();
    mockSyncedGoal.$loaded.and.returnValue(deferredGoalLoaded.promise);

    deferredGoalSave = $q.defer();
    mockSyncedGoal.$save.and.returnValue(deferredGoalSave.promise);
  }));

  describe('updateUser', function() {
    it('should use the appropriate user node', function() {
      GoalService.updateUser(mockUid);

      expect(mockFirebaseRef.child).toHaveBeenCalledWith('user/test:123');
    });

    it('should call $asObject on the firebase object', function() {
      GoalService.updateUser(mockUid);

      expect($firebaseUserObj.$asObject).toHaveBeenCalled();
    });

    it('should load the user', function() {
      GoalService.updateUser(mockUid);

      expect(mockSyncedUser.$loaded).toHaveBeenCalled();
    });

    it('should call $destroy on the user', function() {
      GoalService.updateUser(mockUid);
      deferredUserLoaded.reject();
      $rootScope.$digest();

      expect(mockSyncedUser.$destroy).toHaveBeenCalled();
    });

    describe('_createNewGoal', function() {
      beforeEach(function() {
        mockSyncedUser.goal_id = undefined;
      });

      it('should create a new goal id', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        $rootScope.$digest();

        expect(GuidService.generateGuid).toHaveBeenCalled();
      });

      it('should use the generated id to reference the goal node', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        $rootScope.$digest();

        expect(mockFirebaseRef.child).toHaveBeenCalledWith('goal/' + mockGoalId);
      });

      it('should create a firebase object for that goal node', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        $rootScope.$digest();

        expect($firebase).toHaveBeenCalledWith('goal/' + mockGoalId);
      });

      it('should call $asObject on that object', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        $rootScope.$digest();

        expect($firebaseGoalObj.$asObject).toHaveBeenCalled();
      });

      it('should wait for the new goal object to laod', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        $rootScope.$digest();

        expect(mockSyncedGoal.$loaded).toHaveBeenCalled();
      });

      it('should put the right data in the new goal', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        $rootScope.$digest();

        expect(mockSyncedGoal.owner).toBe(mockUid);
        expect(mockSyncedGoal.days).toBe(90);
      });

      it('should save the new goal', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        $rootScope.$digest();

        expect(mockSyncedGoal.$save).toHaveBeenCalled();
      });

      it('should set the user\'s goal_id to the new goal\'s id', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        deferredGoalSave.resolve();
        $rootScope.$digest();

        expect(mockSyncedUser.goal_id).toBe(mockGoalId);
      });

      it('should save the updated user', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        deferredGoalSave.resolve();
        $rootScope.$digest();

        expect(mockSyncedUser.$save).toHaveBeenCalled();
      });

      it('should destroy the synced goal object', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        deferredGoalSave.resolve();
        deferredUserSave.resolve();
        $rootScope.$digest();

        expect(mockSyncedGoal.$destroy).toHaveBeenCalled();
      });
    });

    describe('_updateExistingGoal', function() {
      beforeEach(function() {
        mockSyncedUser.goal_id = mockGoalId;
      });

      it('should create a firebase object for that user\'s goal node', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        $rootScope.$digest();

        expect($firebase).toHaveBeenCalledWith('goal/' + mockGoalId);
      });

      it('should call $asObject on that object', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        $rootScope.$digest();

        expect($firebaseGoalObj.$asObject).toHaveBeenCalled();
      });

      it('should wait for the new goal object to laod', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        $rootScope.$digest();

        expect(mockSyncedGoal.$loaded).toHaveBeenCalled();
      });

      it('should save the updated goal', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        $rootScope.$digest();

        expect(mockSyncedGoal.$save).toHaveBeenCalled();
      });

      it('should destroy the synced goal object', function() {
        GoalService.updateUser(mockUid);
        deferredUserLoaded.resolve();
        deferredGoalLoaded.resolve();
        deferredGoalSave.resolve();
        $rootScope.$digest();

        expect(mockSyncedGoal.$destroy).toHaveBeenCalled();
      });
    });

  });

});
