'use strict';

describe('Controller: GoalCtrl', function() {

  var mockSession,
      mockFirebaseRef,
      $firebaseRet,
      $firebaseGoalObj,
      deferredBind,
      $rootScope;

  var GoalCtrl,
      $scope,
      $firebase,
      FirebaseService,
      SessionService;

  beforeEach(function() {
    module('simapApp');
  });

  beforeEach(inject(function ($controller, _$rootScope_, $q) {
    mockSession = { goal_id: 'goal-id-lskdfj' };

    $firebaseGoalObj = jasmine.createSpyObj('$firebaseGoalObj', ['$bindTo', '$watch']);
    deferredBind = $q.defer();
    $firebaseGoalObj.$bindTo.and.returnValue(deferredBind.promise);

    $firebaseRet = jasmine.createSpyObj('$firebaseRet', ['$asObject']);
    $firebaseRet.$asObject.and.returnValue($firebaseGoalObj);

    $firebase = jasmine.createSpy('$firebase').and.returnValue($firebaseRet);

    mockFirebaseRef = jasmine.createSpyObj('mockFirebaseRef', ['child']);
    mockFirebaseRef.child.and.callFake(function(node) { return node; });

    FirebaseService = jasmine.createSpyObj('FirebaseService', ['getRef']);
    FirebaseService.getRef.and.returnValue(mockFirebaseRef);

    SessionService = jasmine.createSpyObj('SessionService', ['currentSession']);
    SessionService.currentSession.and.returnValue(mockSession);

    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $scope.goal = { months: 12, days: 365 };

    GoalCtrl = $controller('GoalCtrl', {
      $scope: $scope,
      $firebase: $firebase,
      FirebaseService: FirebaseService,
      SessionService: SessionService
    });
  }));

  describe('initialization', function() {
    it('should get the goal_id from the current session', function() {
      expect(SessionService.currentSession).toHaveBeenCalled();
    });

    it('should get a reference to the goal', function() {
      expect(mockFirebaseRef.child).toHaveBeenCalledWith('goal/goal-id-lskdfj');
    });

    it('should bind the goal object to $scope.goal', function() {
      expect($firebaseGoalObj.$bindTo).toHaveBeenCalledWith($scope, 'goal');
    });

    it('should update the prepared until date', function() {
      deferredBind.resolve();
      $rootScope.$digest();

      expect($scope.preparedUntilDate).toMatch(/^[A-Za-z]+ \d{1,2}, \d{4}$/);
    });
  });

  describe('update', function() {
    beforeEach(function() {
      $scope.goal = {
        months: 12,
        days: 365
      };
    });

    it('should not do anything if goal is undefined', function() {
      var oldMonths = $scope.goal.months;
      $scope.goal = undefined;

      $scope.update();

      expect(oldMonths).toBe(12);
    });

    it('should not do anything if goal is null', function() {
      var oldMonths = $scope.goal.months;
      $scope.goal = undefined;

      $scope.update();

      expect(oldMonths).toBe(12);
    });

    it('should convert the goal\'s months to days', function() {
      $scope.goal.months = 1;

      $scope.update();

      expect($scope.goal.days).toBe(30);
    });

    it('should update the prepared until date', function() {
      var oldDate = $scope.preparedUntilDate;
      $scope.goal.months = $scope.goal.months + 1;

      $scope.update();

      expect($scope.preparedUntilDate).not.toBe(oldDate);
    });
  });

});
