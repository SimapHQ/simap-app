'use strict';

var app = angular.module('simapApp');

app.service('ListService', [
  '$q',
  'CATEGORY_NODE',
  'FirebaseService',
  'ITEM_NODE',
  'SessionService',
  function(
    $q,
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
    var entityList = {},
        entityPromises = [],
        entityIds = SessionService.currentSession()[type];

    if (entityIds === undefined) {
      return entityList;
    }

    entityIds = Object.keys(entityIds);
    entityIds.forEach(function(entityId) {
      var promise = $q.defer(),
          entity = FirebaseService.getObject(NODE[type] + entityId);

      entityPromises.push(promise);

      entity.$loaded().then(function() {
        entityList[entityId] = {
          name: entity.name,
          color: entity.color
        };
        promise.resolve();
      }).finally(function() {
        entity.$destroy();
      });
    });

    return $q.all(entityPromises).then(function() {
      return entityList;
    });
  };

}]);
