'use strict';

describe('Controller: ItemsCtrl', function () {

  var $rootScope,
      deferredCreate,
      deferredRemove;

  var ItemsCtrl,
      $scope,
      $location,
      ListService,
      ItemService;

  beforeEach(function() {
    module('mock.firebase');
    module('simapApp');
  });

  beforeEach(inject(function ($controller, _$rootScope_, $q) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();

    $location = jasmine.createSpyObj('$location', ['path']);

    ListService = jasmine.createSpyObj('ListService', ['getList']);

    ItemService = jasmine.createSpyObj('ItemService', ['createNew', 'removeOld']);

    deferredCreate = $q.defer();
    ItemService.createNew.and.returnValue(deferredCreate.promise);

    deferredRemove = $q.defer();
    ItemService.removeOld.and.returnValue(deferredRemove.promise);

    ItemsCtrl = $controller('ItemsCtrl', {
      $scope: $scope,
      $location: $location,
      ListService: ListService,
      ItemService: ItemService
    });
  }));

  it('should have a help block defined', function() {
    expect($scope.helpBlock).toBeDefined();
  });

  it('should populate the item list', function() {
    expect(ListService.getList).toHaveBeenCalled();
  });

  it('should create a new item when addNewItem is called', function() {
    $scope.addNewItem();

    expect(ItemService.createNew).toHaveBeenCalled();
  });

  it('should redirect the user to the new item edit page when addNewItem is called', function() {
    $scope.addNewItem();
    deferredCreate.resolve('new-id');
    $rootScope.$digest();

    expect($location.path).toHaveBeenCalledWith('/item/edit/new-id');
  });

  it('should redirect the user to the edit item page when editItem is called', function() {
    $scope.editItem('item-id');

    expect($location.path).toHaveBeenCalledWith('/item/edit/item-id');
  });

  it('should delete the item when removeItem is called', function() {
    $scope.removeItem('id-to-delete');

    expect(ItemService.removeOld).toHaveBeenCalledWith('id-to-delete');
  });

  it('should refresh the item list after deleting the old item', function() {
    $scope.removeItem('id-to-delete');
    deferredRemove.resolve();
    $rootScope.$digest();

    expect(ListService.getList.calls.count()).toBe(2);
  });

  it('should not let the user delete a item that still contains items', function() {
    pending();
  });

  it('should give the user a helpful message when they can\'t delete a item', function() {
    pending();
  });

});
