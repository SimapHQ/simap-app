'use strict';

describe('Service: CategoryService', function() {

  var mockFirebaseRef,
      $firebaseObj,
      $rootScope,
      deferredLoaded,
      deferredSave;

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
    // $firebaseObj = jasmine.createSpyObj('$firebaseObj', ['$asObject'])
    // $firebaseObj.$asObject.and.returnValue(mockSyncedUser);
    // $firebase = jasmine.createSpy('$firebase').and.returnValue($firebaseObj);

    // mockFirebaseRef = jasmine.createSpyObj('mockFirebaseRef', ['child']);
    // mockFirebaseRef.child.and.callFake(function() { return $firebaseObj });
    // FirebaseService = jasmine.createSpyObj('FirebaseService', ['getRef']);
    // FirebaseService.getRef.and.callFake(function() { return mockFirebaseRef; });

    // FamilyService = jasmine.createSpyObj('FamilyService', ['updateUser']);
    // GoalService = jasmine.createSpyObj('GoalService', ['updateUser']);

    GuidService = jasmine.createSpyObj('GuidService', ['generateGuid']);
    GuidService.generateGuid.and.returnValue('generated-guid');

    randomColor = jasmine.createSpy('randomColor').and.returnValue('#fafafa');

    SessionService = jasmine.createSpyObj('SessionService', ['currentSession']);
    SessionService.currentSession.and.returnValue({ uid: 'user-id' });

    $provide.value('$firebase', $firebase);
    $provide.value('FirebaseService', FirebaseService);
    $provide.value('GuidService', GuidService);
    $provide.value('randomColor', randomColor);
    $provide.value('SessionService', SessionService);
  }));

  beforeEach(inject(function (_CategoryService_, $q, _$rootScope_) {
    // CategoryService = _CategoryService_;
    // $rootScope = _$rootScope_;

    // deferredLoaded = $q.defer();
    // mockSyncedUser.$loaded.and.returnValue(deferredLoaded.promise);

    // deferredSave = $q.defer();
    // mockSyncedUser.$save.and.returnValue(deferredSave.promise);
    // deferredSave.resolve();
  }));

  describe('createNew', function() {
    it('should ')
  });

});
