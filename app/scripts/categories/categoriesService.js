'use strict';

var app = angular.module('simapApp');

app.service('CategoriesService', [
  '$firebase',
  'CATEGORY_NODE',
  'FirebaseService',
  'SessionService',
  function(
    $firebase,
    CATEGORY_NODE,
    FirebaseService,
    SessionService
  ) {

  var firebaseRef = FirebaseService.getRef();

  this.getCategories = function() {
    var categories = {},
        categoryIds = SessionService.currentSession().categories;

    if (categoryIds === undefined) {
      return categories;
    }

    categoryIds = Object.keys(categoryIds);
    categoryIds.forEach(function(categoryId) {
      var category = $firebase(firebaseRef.child(CATEGORY_NODE + categoryId)).$asObject();
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
