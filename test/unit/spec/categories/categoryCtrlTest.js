'use strict';

describe('Controller: CategoryCtrl', function () {

  // var syncedCategory,
  //     $firebaseObj,
  //     mockFirebaseRef;

  // var CategoryCtrl,
  //     $firebase,
  //     $routeParams,
  //     $scope,
  //     FirebaseService;

  // beforeEach(function() {
  //   module('simapApp');
  // });

  // beforeEach(inject(function ($controller, $rootScope) {
  //   syncedCategory = jasmine.createSpyObj('syncedCategory', ['$bindTo']);

  //   $firebaseObj = jasmine.createSpyObj('$firebaseObj', ['$asObject']);
  //   $firebaseObj.$asObject.and.returnValue(syncedCategory);

  //   $firebase = jasmine.createSpy('$firebase').and.returnValue($firebaseObj);

  //   mockFirebaseRef = jasmine.createSpyObj('mockFirebaseRef', ['child']);
  //   mockFirebaseRef.child.and.callFake(function(node) { return node; });

  //   FirebaseService = jasmine.createSpyObj('FirebaseService', ['getRef']);
  //   FirebaseService.getRef.and.returnValue(mockFirebaseRef);

  //   $routeParams = { categoryId: 'the-cat-id' };

  //   $scope = $rootScope.$new();

  //   CategoryCtrl = $controller('CategoryCtrl', {
  //     $firebase: $firebase,
  //     $routeParams: $routeParams,
  //     $scope: $scope,
  //     FirebaseService: FirebaseService
  //   });
  // }));

  // it('should get the firebase reference from FirebaseService', function() {
  //   expect(FirebaseService.getRef).toHaveBeenCalled();
  // })

  // it('should call $firebase using the right category node', function() {
  //   expect($firebase).toHaveBeenCalledWith('category/the-cat-id');
  // });

  // it('should call bind the node to "category" on the scope', function() {
  //   expect(syncedCategory.$bindTo).toHaveBeenCalledWith($scope, 'category');
  // });

});
