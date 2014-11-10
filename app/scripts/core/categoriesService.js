'use strict';

var app = angular.module('simapApp');

app.service('CategoriesService', [
  '$firebase',
  '$q',
  'CATEGORY_NODE',
  'FirebaseService',
  'GuidService',
  'SessionService',
  function(
    $firebase,
    $q,
    CATEGORY_NODE,
    FirebaseService,
    GuidService,
    SessionService
  ) {

  var firebaseRef = FirebaseService.getRef(),
      categories = {};

  this.getCategories = function() {
    return categories;
  };

  this.refreshCategories = function() {

    Object.keys(categories).forEach(function(categoryId) {
      categories[categoryId].$destroy();
    });

    var loadedPromises = [];

    categories = {};
    Object.keys(SessionService.currentSession('categories')).forEach(function(categoryId) {
      categories[categoryId] = FirebaseService.getObject(CATEGORY_NODE + categoryId);
      loadedPromises.push(categories[categoryId].$loaded());
    });

    return $q.all(loadedPromises);
  };

  this.addNew = function(categoryObj) {
    var newCategoryId = GuidService.generateGuid();
    var newCategoryObj = FirebaseService.getObject(CATEGORY_NODE + newCategoryId);

    return newCategoryObj.$loaded().then(function() {
      categoryObj.owner = SessionService.uid();
      $.extend(newCategoryObj, categoryObj);
      return newCategoryObj.$save().then(function() {
        categories[newCategoryId] = newCategoryObj;
        return newCategoryId;
      });
    });
  };

  this.removeOld = function(categoryId) {
    return $firebase(firebaseRef.child(CATEGORY_NODE + categoryId)).$remove().then(function() {
      categories[categoryId].$destroy();
      delete categories[categoryId];
      return categoryId;
    });
  };

}]);
