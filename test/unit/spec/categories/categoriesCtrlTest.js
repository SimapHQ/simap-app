'use strict';

describe('Controller: CategoriesCtrl', function () {

  // var $rootScope,
  //     deferredCreate,
  //     deferredRemove;

  // var CategoriesCtrl,
  //     $scope,
  //     $location,
  //     ListService,
  //     CategoryService;

  // beforeEach(function() {
  //   module('mock.firebase');
  //   module('simapApp');
  // });

  // beforeEach(inject(function ($controller, _$rootScope_, $q) {
  //   $rootScope = _$rootScope_;
  //   $scope = $rootScope.$new();

  //   $location = jasmine.createSpyObj('$location', ['path']);

  //   ListService = jasmine.createSpyObj('ListService', ['getList']);

  //   CategoryService = jasmine.createSpyObj('CategoryService', ['createNew', 'removeOld']);

  //   deferredCreate = $q.defer();
  //   CategoryService.createNew.and.returnValue(deferredCreate.promise);

  //   deferredRemove = $q.defer();
  //   CategoryService.removeOld.and.returnValue(deferredRemove.promise);

  //   CategoriesCtrl = $controller('CategoriesCtrl', {
  //     $scope: $scope,
  //     $location: $location,
  //     ListService: ListService,
  //     CategoryService: CategoryService
  //   });
  // }));

  // it('should have a help block defined', function() {
  //   expect($scope.helpBlock).toBeDefined();
  // });

  // it('should populate the category list', function() {
  //   expect(ListService.getList).toHaveBeenCalled();
  // });

  // it('should create a new category when addNewCategory is called', function() {
  //   $scope.addNewCategory();

  //   expect(CategoryService.createNew).toHaveBeenCalled();
  // });

  // it('should redirect the user to the new category edit page when addNewCategory is called', function() {
  //   $scope.addNewCategory();
  //   deferredCreate.resolve('new-id');
  //   $rootScope.$digest();

  //   expect($location.path).toHaveBeenCalledWith('/category/edit/new-id');
  // });

  // it('should redirect the user to the edit category page when editCategory is called', function() {
  //   $scope.editCategory('category-id');

  //   expect($location.path).toHaveBeenCalledWith('/category/edit/category-id');
  // });

  // it('should delete the category when removeCategory is called', function() {
  //   $scope.removeCategory('id-to-delete');

  //   expect(CategoryService.removeOld).toHaveBeenCalledWith('id-to-delete');
  // });

  // it('should refresh the category list after deleting the old category', function() {
  //   $scope.removeCategory('id-to-delete');
  //   deferredRemove.resolve();
  //   $rootScope.$digest();

  //   expect(ListService.getList.calls.count()).toBe(2);
  // });

  // it('should not let the user delete a category that still contains items', function() {
  //   pending();
  // });

  // it('should give the user a helpful message when they can\'t delete a category', function() {
  //   pending();
  // });

});
