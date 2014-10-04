'use strict';

describe('Controller: ItemsCtrl', function () {

  var ItemsCtrl,
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

    ItemsCtrl = $controller('ItemsCtrl', {
      $scope: $scope,
      $location: $location,
      randomColor: randomColor
    });
  }));

  it('should create a new item when addNewItem is called', function() {

  });

  it('should redirect the user to the edit page when addNewItem is called', function() {

  });

  it('should redirect the user to the edit page wehn editItem is called', function() {

  });

  it('should remove the item when removeItem is called', function() {

  });

  it('should be very difficult to remove an item!', function() {

  });
  
});
