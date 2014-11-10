'use strict';

var app = angular.module('simapApp');

app.service('CategoryService', [
  'CategoriesService',
  'DEFAULT_CATEGORY_NAME',
  'randomColor',
  'SessionService',
  function(
    CategoriesService,
    DEFAULT_CATEGORY_NAME,
    randomColor,
    SessionService
  ) {

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
    // TODO: Make sure the category is unused...
    return CategoriesService.removeOld(categoryId).then(function(removedId) {
      return SessionService.unbindFromUser('categories', removedId);
    });
  };

}]);
