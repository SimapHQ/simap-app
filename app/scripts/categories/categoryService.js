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

  var firebaseRef = FirebaseService.getRef();

  this.createNew = function() {
    var uid = SessionService.currentSession().uid,
        newCategoryId = GuidService.generateGuid();

    var newCategoryObj = $firebase(firebaseRef.child(CATEGORY_NODE + newCategoryId)).$asObject();

    return newCategoryObj.$loaded().then(function() {
      newCategoryObj.owner = uid;
      newCategoryObj.name = DEFAULT_CATEGORY_NAME;
      newCategoryObj.color = randomColor();

      return newCategoryObj.$save().then(function() {
        return SessionService.bindToUser('categories', newCategoryId);
      });
    }).finally(function() {
      newCategoryObj.$destroy();
    });
  };

  this.removeOld = function(categoryId) {
    if (SessionService.currentSession().categories[categoryId] !== true) {
      return;
    }

    // TODO: Make sure the category is unused...
    return $firebase(firebaseRef.child(CATEGORY_NODE + categoryId)).$remove().then(function() {
      return SessionService.unbindFromUser('categories', categoryId);
    });
  };

}]);
