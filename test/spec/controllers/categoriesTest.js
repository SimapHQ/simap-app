'use strict';

describe('Controller: CategoriesCtrl', function () {

  var CategoriesCtrl,
      $scope,
      $location,
      randomColor;

  beforeEach(function() {
    module('mock.firebase');
    module('simapApp');
  });

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    $location = jasmine.createSpyObj('$location', ['path']);
    randomColor = jasmine.createSpy('randomColor');

    CategoriesCtrl = $controller('CategoriesCtrl', {
      $scope: $scope,
      $location: $location,
      randomColor: randomColor
    });
  }));

  it('should have a help block defined', function() {
    expect($scope.helpBlock).toBeDefined();
  });
  
  it('should create a new category when addNewCategory is called', function() {
    pending();
  });

  it('should redirect the user to the new category edit page when addNewCategory is called', function() {
    $scope.addNewCategory();

    expect($location.path).toHaveBeenCalledWith('/category/edit/34');
  });

  it('should redirect the user to the edit category page when editCategory is called', function() {
    $scope.editCategory();

    expect($location.path).toHaveBeenCalledWith('/category/edit/categoryid');
  });

  it('should delete the category when removeCategory is called', function() {
    pending();
  });

  it('should not let the user delete a category that still contains items', function() {
    pending();
  });

  it('should give the user a helpful message when they can\'t delete a category', function() {
    pending();
  });
  
});
