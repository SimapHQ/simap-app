'use strict';

describe('Service: CategoriesService', function() {

  var mockSession,
      syncedCategory1,
      syncedCategory2,
      $rootScope,
      deferredLoaded;

  var CategoriesService,
      $firebase,
      FirebaseService,
      SessionService;

  beforeEach(function() {
    module('simapApp');
  });

  beforeEach(module('simapApp', function($provide) {
    mockSession = {
      categories: {
        cid1: true,
        cid3: true
      }
    };

    syncedCategory1 = jasmine.createSpyObj('syncedCategory1', ['$loaded', '$destroy']);
    syncedCategory1.name = 'Category 1';
    syncedCategory1.color = '#fafafa';

    syncedCategory2 = jasmine.createSpyObj('syncedCategory2', ['$loaded', '$destroy']);
    syncedCategory2.name = 'Category 2';
    syncedCategory2.color = '#bbbbbb';

    FirebaseService = jasmine.createSpyObj('FirebaseService', ['getObject']);
    FirebaseService.getObject.and.callFake(function(path) {
      if (path === 'category/cid1') {
        return syncedCategory1;
      } else {
        return syncedCategory2;
      }
    });

    SessionService = jasmine.createSpyObj('SessionService', ['currentSession']);
    SessionService.currentSession.and.returnValue(mockSession);

    $provide.value('$firebase', $firebase);
    $provide.value('FirebaseService', FirebaseService);
    $provide.value('SessionService', SessionService);
  }));

  beforeEach(inject(function (_CategoriesService_, $q, _$rootScope_) {
    CategoriesService = _CategoriesService_;
    $rootScope = _$rootScope_;

    deferredLoaded = $q.defer();
    syncedCategory1.$loaded.and.returnValue(deferredLoaded.promise);
    syncedCategory2.$loaded.and.returnValue(deferredLoaded.promise);
    deferredLoaded.resolve();
  }));

  describe('getCategories', function() {
    it('should reference the right node for each category', function() {
      CategoriesService.getCategories();

      expect(FirebaseService.getObject).toHaveBeenCalledWith('category/cid1');
      expect(FirebaseService.getObject).toHaveBeenCalledWith('category/cid3');
    });

    it('should return an empty object if the user has no categories', function() {
      mockSession.categories = undefined;
      var categories = CategoriesService.getCategories();

      expect(categories).toEqual({});
    });

    it('should return an object of all the categories', function() {
      var categories = CategoriesService.getCategories();
      $rootScope.$digest();

      expect(categories).toEqual({
        'cid1': {
          name: 'Category 1',
          color: '#fafafa'
        },
        'cid3': {
          name: 'Category 2',
          color: '#bbbbbb'
        }
      });
    });

    it('should $destroy each category when done', function() {
      CategoriesService.getCategories();
      $rootScope.$digest();

      expect(syncedCategory1.$destroy).toHaveBeenCalled();
      expect(syncedCategory2.$destroy).toHaveBeenCalled();
    });
  });

});
