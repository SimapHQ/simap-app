'use strict';

describe('Controller: FamilyCtrl', function() {

  var mockSession,
      mockFirebaseRef,
      $firebaseRet,
      $firebaseFamilyObj,
      deferredAdultsBind,
      deferredChildrenBind,
      $rootScope;

  var FamilyCtrl,
      $scope,
      $firebase,
      FirebaseService,
      SessionService;

  beforeEach(function() {
    module('simapApp');
  });

  beforeEach(inject(function ($controller, _$rootScope_, $q) {
    mockSession = { family_id: 'family-id-lskdfj' };

    $firebaseFamilyObj = jasmine.createSpyObj('$firebaseFamilyObj', ['$bindTo']);
    deferredAdultsBind = $q.defer();
    $firebaseFamilyObj.$bindTo.and.returnValue(deferredAdultsBind.promise);
    deferredChildrenBind = $q.defer();
    $firebaseFamilyObj.$bindTo.and.returnValue(deferredChildrenBind.promise);

    $firebaseRet = jasmine.createSpyObj('$firebaseRet', ['$asObject']);
    $firebaseRet.$asObject.and.returnValue($firebaseFamilyObj);

    $firebase = jasmine.createSpy('$firebase').and.returnValue($firebaseRet);

    mockFirebaseRef = jasmine.createSpyObj('mockFirebaseRef', ['child']);
    mockFirebaseRef.child.and.callFake(function(node) { return node; });

    FirebaseService = jasmine.createSpyObj('FirebaseService', ['getRef']);
    FirebaseService.getRef.and.returnValue(mockFirebaseRef);

    SessionService = jasmine.createSpyObj('SessionService', ['currentSession']);
    SessionService.currentSession.and.returnValue(mockSession);

    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $scope.family = { adults: 2, children: 3 };

    FamilyCtrl = $controller('FamilyCtrl', {
      $scope: $scope,
      $firebase: $firebase,
      FirebaseService: FirebaseService,
      SessionService: SessionService
    });
  }));

  describe('initialization', function() {
    it('should get the family_id from the current session', function() {
      expect(SessionService.currentSession).toHaveBeenCalled();
    });

    it('should get a reference to the family', function() {
      expect(mockFirebaseRef.child).toHaveBeenCalledWith('family/family-id-lskdfj');
    });

    it('should bind the family object to $scope.family', function() {
      expect($firebaseFamilyObj.$bindTo).toHaveBeenCalledWith($scope, 'family');
    });
  });
});
