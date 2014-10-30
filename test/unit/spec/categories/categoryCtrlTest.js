'use strict';

describe('Controller: CategoryCtrl', function () {

  var CategoryCtrl, 
      $scope,
      $location,
      randomColor;

  beforeEach(function() {
    module('mock.firebase');
    module('simapApp');
  });

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    randomColor = jasmine.createSpy('randomColor');

    CategoryCtrl = $controller('CategoryCtrl', {
      $scope: $scope,
      $location: $location,
      randomColor: randomColor
    });
  }));

  xit('should let the user save changes to a category', function() {

  });
  
});
