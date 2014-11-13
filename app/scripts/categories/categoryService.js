'use strict';

var app = angular.module('simapApp');

app.service('CategoryService', [
  '$log',
  'CategoriesService',
  'DEFAULT_CATEGORY_NAME',
  'ItemsService',
  'randomColor',
  'SessionService',
  function(
    $log,
    CategoriesService,
    DEFAULT_CATEGORY_NAME,
    ItemsService,
    randomColor,
    SessionService
  ) {

  var items = ItemsService.getItems();

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

    return CategoriesService.addNew(newCategoryObj).then(function(newCategoryId) {
      return SessionService.bindToUser('categories', newCategoryId);
    });
  };

  this.removeOld = function(categoryId) {
    if (_itemsInCategory(categoryId).length > 0) {
      $log.error('Can\'t delete categories that contain items', categoryId);
      return;
    }

    return CategoriesService.removeOld(categoryId).then(function(removedId) {
      return SessionService.unbindFromUser('categories', removedId);
    });
  };

  this.itemsInCategory = _itemsInCategory;

}]);
