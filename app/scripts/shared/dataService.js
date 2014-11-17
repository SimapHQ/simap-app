'use strict';

var app = angular.module('simapApp');

app.service('DataService', [
  '$firebase',
  '$q',
  'CATEGORY_NODE',
  'CATEGORY_TYPE',
  'CONVERSION_NODE',
  'CONVERSION_TYPE',
  'FirebaseService',
  'GuidService',
  'ITEM_NODE',
  'ITEM_TYPE',
  'PLAN_NODE',
  'PLAN_TYPE',
  'SessionService',
  'UNIT_NODE',
  'UNIT_TYPE',
  function(
    $firebase,
    $q,
    CATEGORY_NODE,
    CATEGORY_TYPE,
    CONVERSION_NODE,
    CONVERSION_TYPE,
    FirebaseService,
    GuidService,
    ITEM_NODE,
    ITEM_TYPE,
    PLAN_NODE,
    PLAN_TYPE,
    SessionService,
    UNIT_NODE,
    UNIT_TYPE
  ) {

  var firebaseRef = FirebaseService.getRef(),
      data = {
        categories: {},
        items: {},
        plans: {},
        units: {},
        conversions: {}
      },
      NODES = {};

  NODES[CATEGORY_TYPE] = CATEGORY_NODE;
  NODES[ITEM_TYPE] = ITEM_NODE;
  NODES[UNIT_TYPE] = UNIT_NODE;
  NODES[CONVERSION_TYPE] = CONVERSION_NODE;
  NODES[PLAN_TYPE] = PLAN_NODE;

  var _destroyData = function() {
    Object.keys(data).forEach(function(type) {
      Object.keys(data[type]).forEach(function(id) {
        data[type][id].$destroy();
      });
    });
  };

  var _load = function(type, idList) {
    var loadedPromises = [];
    idList.forEach(function(id) {
      data[type][id] = FirebaseService.getObject(NODES[type] + id);
      loadedPromises.push(data[type][id].$loaded());
    });

    return $q.all(loadedPromises);
  };

  var _getUnitIds = function() {
    var unitIds = [];

    Object.keys(data.items).forEach(function(itemId) {
      var itemUnitIds = data.items[itemId].units;
      if (itemUnitIds === undefined) {
        return;
      }

      unitIds = unitIds.concat(Object.keys(itemUnitIds));
    });

    return unitIds;
  };

  var _getPlanIds = function() {
    var planIds = [];

    Object.keys(data.items).forEach(function(itemId) {
      planIds.push(data.items[itemId].planId);
    });

    return planIds;
  };

  var _removeInverseConversions = function(unitId) {
    Object.keys(data.conversions).forEach(function(conversionId) {
      delete data.conversions[conversionId][unitId];
    });
  };

  this.getData = function() {
    return data;
  };

  this.refreshData = function() {
    _destroyData();

    return $q.all([
      _load(CATEGORY_TYPE, Object.keys(SessionService.currentSession(CATEGORY_TYPE))),
      _load(ITEM_TYPE, Object.keys(SessionService.currentSession(ITEM_TYPE)))
    ]).then(function() {
      return _load(UNIT_TYPE, _getUnitIds());
    }).then(function() {
      return $q.all([
        _load(CONVERSION_TYPE, Object.keys(data.units)),
        _load(PLAN_TYPE, _getPlanIds())
      ]);
    });
  };

  this.addNew = function(type, obj, objId) {
    var id = objId || GuidService.generateGuid();
    var newObject = FirebaseService.getObject(NODES[type] + id);

    return newObject.$loaded().then(function() {
      obj.owner = SessionService.uid();
      $.extend(newObject, obj);
      return newObject.$save().then(function() {
        data[type][id] = newObject;
        return id;
      });
    });
  };

  this.removeOld = function(type, id) {
    return $firebase(firebaseRef.child(NODES[type] + id)).$remove().then(function() {
      data[type][id].$destroy();
      delete data[type][id];

      if (type === CONVERSION_TYPE) {
        _removeInverseConversions(id);
      }

      return id;
    });
  };

}]);
