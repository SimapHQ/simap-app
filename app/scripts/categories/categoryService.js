'use strict';

var app = angular.module('simapApp');

app.service('CategoryService', [
  '$firebase',
  'CATEGORY_NODE',
  'DEFAULT_CATEGORY_NAME',
  'FirebaseService',
  'GuidService',
  'randomColor',
  'SessionService',
  function(
    $firebase,
    CATEGORY_NODE,
    DEFAULT_CATEGORY_NAME,
    FirebaseService,
    GuidService,
    randomColor,
    SessionService
  ) {

  var firebaseRef = FirebaseService.getRef(),
      categories = {};

  this.createNew = function() {
    var uid = SessionService.currentSession('uid');
        newCategoryId = GuidService.generateGuid();

    var newCategoryObj = FirebaseService.getObject(CATEGORY_NODE + newCategoryId);

    return newCategoryObj.$loaded().then(function() {
      newCategoryObj.owner = uid;
      newCategoryObj.name = DEFAULT_CATEGORY_NAME;
      newCategoryObj.color = randomColor();

      return newCategoryObj.$save().then(function() {
        categories[newCategoryId] = newCategoryObj;
        return SessionService.bindToUser('categories', newCategoryId);
      });
    });
  };

  this.removeOld = function(categoryId) {
    if (SessionService.currentSession('categories')[categoryId] !== true) {
      return;
    }

    // TODO: Make sure the category is unused...
    return $firebase(firebaseRef.child(CATEGORY_NODE + categoryId)).$remove().then(function() {
      delete categories[categoryId];
      return SessionService.unbindFromUser('categories', categoryId);
    });
  };

  this.getCategories = function() {
    return categories;
  };

  var refreshCategories = function() {
    Object.keys(categories).forEach(function(categoryId) {
      categories[categoryId].$destroy();
    });

    categories = {};

    Object.keys(SessionService.currentSession().categories).forEach(function(categoryId) {
      categories[categoryId] = FirebaseService.getObject(CATEGORY_NODE + categoryId);
    });
  };

  refreshCategories();

}]);
