'use strict';

describe('Service: ListService', function() {

  var mockSession,
      syncedItem1,
      syncedItem2,
      $rootScope,
      deferredLoaded;

  var ListService,
      $firebase,
      FirebaseService,
      SessionService;

  beforeEach(function() {
    module('simapApp');
  });

  beforeEach(module('simapApp', function($provide) {
    mockSession = {
      items: {
        itemid1: true,
        itemid3: true
      }
    };

    syncedItem1 = jasmine.createSpyObj('syncedItem1', ['$loaded', '$destroy']);
    syncedItem1.name = 'Item 1';
    syncedItem1.color = '#fafafa';

    syncedItem2 = jasmine.createSpyObj('syncedItem2', ['$loaded', '$destroy']);
    syncedItem2.name = 'Item 2';
    syncedItem2.color = '#bbbbbb';

    FirebaseService = jasmine.createSpyObj('FirebaseService', ['getObject']);
    FirebaseService.getObject.and.callFake(function(path) {
      if (path === 'item/itemid1') {
        return syncedItem1;
      } else {
        return syncedItem2;
      }
    });

    SessionService = jasmine.createSpyObj('SessionService', ['currentSession']);
    SessionService.currentSession.and.returnValue(mockSession);

    $provide.value('$firebase', $firebase);
    $provide.value('FirebaseService', FirebaseService);
    $provide.value('SessionService', SessionService);
  }));

  beforeEach(inject(function (_ListService_, $q, _$rootScope_) {
    ListService = _ListService_;
    $rootScope = _$rootScope_;

    deferredLoaded = $q.defer();
    syncedItem1.$loaded.and.returnValue(deferredLoaded.promise);
    syncedItem2.$loaded.and.returnValue(deferredLoaded.promise);
    deferredLoaded.resolve();
  }));

  describe('getList', function() {
    it('should reference the right node for each item', function() {
      ListService.getList('items');

      expect(FirebaseService.getObject).toHaveBeenCalledWith('item/itemid1');
      expect(FirebaseService.getObject).toHaveBeenCalledWith('item/itemid3');
    });

    it('should return an empty object if the user has no items', function() {
      mockSession.items = undefined;
      var items = ListService.getList('items');

      expect(items).toEqual({});
    });

    it('should return an empty object if an invalid type is specified', function() {
      var stuff = ListService.getList('stuff');

      expect(stuff).toEqual({});
    });

    it('should return an object of all the items', function() {
      var items = ListService.getList('items');
      $rootScope.$digest();

      expect(items).toEqual({
        'itemid1': {
          name: 'Item 1',
          color: '#fafafa'
        },
        'itemid3': {
          name: 'Item 2',
          color: '#bbbbbb'
        }
      });
    });

    it('should $destroy each item when done', function() {
      ListService.getList('items');
      $rootScope.$digest();

      expect(syncedItem1.$destroy).toHaveBeenCalled();
      expect(syncedItem2.$destroy).toHaveBeenCalled();
    });
  });

});
