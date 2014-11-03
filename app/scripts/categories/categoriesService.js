'use strict';

var app = angular.module('simapApp');

app.service('CategoriesService', [
  'CATEGORY_NODE',
  'FirebaseService',
  'SessionService',
  function(
    CATEGORY_NODE,
    FirebaseService,
    SessionService
  ) {

  this.getCategories = function() {
    var categories = {},
        categoryIds = SessionService.currentSession().categories;

    if (categoryIds === undefined) {
      return categories;
    }

    categoryIds = Object.keys(categoryIds);
    categoryIds.forEach(function(categoryId) {
      var category = FirebaseService.getObject(CATEGORY_NODE + categoryId);
      category.$loaded().then(function() {
        categories[categoryId] = {
          name: category.name,
          color: category.color
        };
      }).finally(function() {
        category.$destroy();
      });
    });

    return categories;
  };

}]);
