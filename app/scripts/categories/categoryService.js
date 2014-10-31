'use strict';

var app = angular.module('simapApp');

app.service('CategoryService', [
  '$firebase',
  '$log',
  'CATEGORY_NODE',
  'FirebaseService',
  'GuidService',
  'randomColor',
  'SessionService',
  function(
    $firebase,
    $log,
    CATEGORY_NODE,
    FirebaseService,
    GuidService,
    randomeColor,
    SessionService
  ) {

  var firebaseRef = FirebaseService.getRef();

  this.createNew = function() {
    var uid = SessionService.currentSession().uid,
        newCategoryId = GuidService.generateGuid();

    var newCategoryObj = $firebase(firebaseRef.child(CATEGORY_NODE + newCategoryId)).$asObject();

    return newCategoryObj.$loaded().then(function() {
      newCategoryObj.owner = uid;
      newCategoryObj.name = 'New Category Name';
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
