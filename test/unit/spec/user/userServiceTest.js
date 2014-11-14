'use strict';

describe('Service: UserService', function() {

  // var mockUser,
  //     mockSyncedUser,
  //     mockFirebaseRef,
  //     $firebaseObj,
  //     $rootScope,
  //     deferredLoaded,
  //     deferredSave;

  // var UserService,
  //     $firebase,
  //     $log,
  //     FamilyService,
  //     FirebaseService,
  //     GoalService;

  // beforeEach(function() {
  //   module('simapApp');
  // });

  // beforeEach(module('simapApp', function($provide) {
  //   mockUser = {
  //     uid: 'test:123',
  //     provider: 'test',
  //     id: '123',
  //     displayName: 'Name'
  //  };

  //   mockSyncedUser = jasmine.createSpyObj('mockSyncedUser', ['$loaded', '$save', '$destroy']);
  //   mockSyncedUser.$value = null;

  //   $firebaseObj = jasmine.createSpyObj('$firebaseObj', ['$asObject'])
  //   $firebaseObj.$asObject.and.returnValue(mockSyncedUser);
  //   $firebase = jasmine.createSpy('$firebase').and.returnValue($firebaseObj);

  //   mockFirebaseRef = jasmine.createSpyObj('mockFirebaseRef', ['child']);
  //   mockFirebaseRef.child.and.callFake(function() { return $firebaseObj });
  //   FirebaseService = jasmine.createSpyObj('FirebaseService', ['getRef']);
  //   FirebaseService.getRef.and.callFake(function() { return mockFirebaseRef; });

  //   FamilyService = jasmine.createSpyObj('FamilyService', ['updateUser']);
  //   GoalService = jasmine.createSpyObj('GoalService', ['updateUser']);

  //   $log = jasmine.createSpyObj('$log', ['debug', 'error']);

  //   $provide.value('$firebase', $firebase);
  //   $provide.value('$log', $log);
  //   $provide.value('FamilyService', FamilyService);
  //   $provide.value('FirebaseService', FirebaseService);
  //   $provide.value('GoalService', GoalService);
  // }));

  // beforeEach(inject(function (_UserService_, $q, _$rootScope_) {
  //   UserService = _UserService_;
  //   $rootScope = _$rootScope_;

  //   deferredLoaded = $q.defer();
  //   mockSyncedUser.$loaded.and.returnValue(deferredLoaded.promise);

  //   deferredSave = $q.defer();
  //   mockSyncedUser.$save.and.returnValue(deferredSave.promise);
  //   deferredSave.resolve();
  // }));

  // describe('updateUser', function() {
  //   it('should use the appropriate user node', function() {
  //     UserService.updateUser(mockUser);

  //     expect(mockFirebaseRef.child).toHaveBeenCalledWith('user/test:123');
  //   });

  //   it('should create a new user if one doesn\'t exist', function() {
  //     UserService.updateUser(mockUser);
  //     deferredLoaded.resolve();
  //     $rootScope.$digest();

  //     expect(mockSyncedUser.uid).toBe(mockUser.uid);
  //     expect(mockSyncedUser.provider).toBe(mockUser.provider);
  //     expect(mockSyncedUser.provider_uid).toBe(mockUser.id);
  //     expect(mockSyncedUser.display_name).toBe(mockUser.displayName);
  //     expect(mockSyncedUser.$save).toHaveBeenCalled();
  //   });

  //   it('should update an existing user', function() {
  //     mockSyncedUser.$value = undefined;
  //     UserService.updateUser(mockUser);
  //     deferredLoaded.resolve();
  //     $rootScope.$digest();

  //     expect(mockSyncedUser.uid).toBeUndefined();
  //     expect(mockSyncedUser.provider).toBeUndefined();
  //     expect(mockSyncedUser.provider_uid).toBeUndefined();
  //     expect(mockSyncedUser.display_name).toBe(mockUser.displayName);
  //     expect(mockSyncedUser.$save).toHaveBeenCalled();
  //   });

  //   it('should destroy the reference afterwards', function() {
  //     UserService.updateUser(mockUser);
  //     deferredLoaded.resolve();
  //     $rootScope.$digest();

  //     expect(mockSyncedUser.$destroy).toHaveBeenCalled();
  //   });

  //   it('should destroy the reference even if something fails', function() {
  //     UserService.updateUser(mockUser);
  //     deferredLoaded.reject();
  //     $rootScope.$digest();

  //     expect(mockSyncedUser.$destroy).toHaveBeenCalled();
  //   });

  //   it('should use the FamilyService to update the user\'s family', function() {
  //     UserService.updateUser(mockUser);
  //     deferredLoaded.resolve();
  //     $rootScope.$digest();

  //     expect(FamilyService.updateUser).toHaveBeenCalledWith('test:123');
  //   });

  //   it('should use the GoalService to update the user\'s goal', function() {
  //     UserService.updateUser(mockUser);
  //     deferredLoaded.resolve();
  //     $rootScope.$digest();

  //     expect(GoalService.updateUser).toHaveBeenCalledWith('test:123');
  //   });
  // });

});
