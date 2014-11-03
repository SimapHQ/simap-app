'use strict';

var app = angular.module('simapApp');

app.service('ListService', [
  'CATEGORY_NODE',
  'FirebaseService',
  'ITEM_NODE',
  'SessionService',
  function(
    CATEGORY_NODE,
    FirebaseService,
    ITEM_NODE,
    SessionService
  ) {

  var NODE = {
    items: ITEM_NODE,
    categories: CATEGORY_NODE
  };

  this.getList = function(type) {
    var list = {},
        itemIds = SessionService.currentSession()[type];

    if (itemIds === undefined) {
      return list;
    }

    itemIds = Object.keys(itemIds);
    itemIds.forEach(function(itemId) {
      var item = FirebaseService.getObject(NODE[type] + itemId);
      item.$loaded().then(function() {
        list[itemId] = {
          name: item.name,
          color: item.color
        };
      }).finally(function() {
        item.$destroy();
      });
    });

    return list;
  };

}]);
