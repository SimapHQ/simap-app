'use strict';

var app = angular.module('simapApp');

app.service('DataService', [
  '$firebase',
  '$log',
  '$q',
  'CATEGORY_NODE',
  'CATEGORY_TYPE',
  'CONVERSION_NODE',
  'CONVERSION_TYPE',
  'DEFAULT_FAMILY_SIZE_ADULTS',
  'DEFAULT_FAMILY_SIZE_CHILDREN',
  'DEFAULT_GOAL_DAYS',
  'DEFAULT_GOAL_MONTHS',
  'FAMILY_NODE',
  'FAMILY_TYPE',
  'FirebaseService',
  'GOAL_NODE',
  'GOAL_TYPE',
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
    $log,
    $q,
    CATEGORY_NODE,
    CATEGORY_TYPE,
    CONVERSION_NODE,
    CONVERSION_TYPE,
    DEFAULT_FAMILY_SIZE_ADULTS,
    DEFAULT_FAMILY_SIZE_CHILDREN,
    DEFAULT_GOAL_DAYS,
    DEFAULT_GOAL_MONTHS,
    FAMILY_NODE,
    FAMILY_TYPE,
    FirebaseService,
    GOAL_NODE,
    GOAL_TYPE,
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
        conversions: {},
        family: undefined,
        goal: undefined
      },
      NODES = {};

  NODES[CATEGORY_TYPE] = CATEGORY_NODE;
  NODES[ITEM_TYPE] = ITEM_NODE;
  NODES[UNIT_TYPE] = UNIT_NODE;
  NODES[CONVERSION_TYPE] = CONVERSION_NODE;
  NODES[PLAN_TYPE] = PLAN_NODE;
  NODES[FAMILY_TYPE] = FAMILY_NODE;
  NODES[GOAL_TYPE] = GOAL_NODE;

  var _destroyData = function() {
    Object.keys(data).forEach(function(type) {
      if (type === FAMILY_TYPE || type === GOAL_TYPE) {
        if (data[type] !== undefined) {
          data[type].$destroy();
        }
        return;
      }

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

  var _loadSingle = function(type) {
    var idStr;
    if (type === FAMILY_TYPE) {
      idStr = 'familyId';
    } else if (type === GOAL_TYPE) {
      idStr = 'goalId';
    }

    var id = SessionService.currentSession(idStr);

    if (!$.isEmptyObject(id)) {
      data[type] = FirebaseService.getObject(NODES[type] + id);
      return data[type].$loaded();
    }

    id = GuidService.generateGuid();
    data[type] = FirebaseService.getObject(NODES[type] + id);

    return data[type].$loaded().then(function() {
      data[type].owner = SessionService.uid();

      if (type === FAMILY_TYPE) {
        data[type].adults = DEFAULT_FAMILY_SIZE_ADULTS;
        data[type].children = DEFAULT_FAMILY_SIZE_CHILDREN;
      } else if (type === GOAL_TYPE) {
        data.goal.days = DEFAULT_GOAL_DAYS;
        data.goal.months = DEFAULT_GOAL_MONTHS;
      }

      data[type].$save().then(function() {
        SessionService.currentSession()[idStr] = id;
        return SessionService.currentSession().$save().then(function() {
          return id;
        });
      });
    });
  };

  this.getData = function() {
    return data;
  };

  this.refreshData = function() {
    _destroyData();

    var waitFor = [
      _loadSingle(FAMILY_TYPE),
      _loadSingle(GOAL_TYPE)
    ];

    return $q.all([
      _load(CATEGORY_TYPE, Object.keys(SessionService.currentSession(CATEGORY_TYPE))),
      _load(ITEM_TYPE, Object.keys(SessionService.currentSession(ITEM_TYPE)))
    ]).then(function() {
      return _load(UNIT_TYPE, _getUnitIds());
    }).then(function() {
      return $q.all([
        _load(CONVERSION_TYPE, Object.keys(data.units)),
        _load(PLAN_TYPE, _getPlanIds())
      ].concat(waitFor));
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
