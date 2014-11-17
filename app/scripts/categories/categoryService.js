'use strict';

var app = angular.module('simapApp');

app.service('CategoryService', [
  '$log',
  'CATEGORY_TYPE',
  'DataService',
  'DEFAULT_CATEGORY_NAME',
  'randomColor',
  'SessionService',
  function(
    $log,
    CATEGORY_TYPE,
    DataService,
    DEFAULT_CATEGORY_NAME,
    randomColor,
    SessionService
  ) {

  var items = DataService.getData().items;

  var _itemsInCategory = function(categoryId) {
    var itemsInCategory = [];

    Object.keys(items).forEach(function(itemId) {
      if (items[itemId].categoryId === categoryId) {
        itemsInCategory.push(items[itemId].name);
      }
    });

    return itemsInCategory;
  };

  this.createNew = function() {
    var newCategoryObj = {
      name: DEFAULT_CATEGORY_NAME,
      color: randomColor()
    };

    return DataService.addNew(CATEGORY_TYPE, newCategoryObj).then(function(newCategoryId) {
      return SessionService.bindToUser(CATEGORY_TYPE, newCategoryId);
    });
  };

  this.removeOld = function(categoryId) {
    if (_itemsInCategory(categoryId).length > 0) {
      $log.error('Can\'t delete categories that contain items', categoryId);
      return;
    }

    return DataService.removeOld(CATEGORY_TYPE, categoryId).then(function(removedId) {
      return SessionService.unbindFromUser(CATEGORY_TYPE, removedId);
    });
  };

  this.itemsInCategory = _itemsInCategory;

}]);
