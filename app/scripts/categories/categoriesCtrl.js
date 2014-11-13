'use strict';

var app = angular.module('simapApp');

app.controller('CategoriesCtrl', [
  '$location',
  '$scope',
  'CategoriesService',
  'CategoryService',
  'SimapModalService',
  'WaitingService',
  function (
    $location,
    $scope,
    CategoriesService,
    CategoryService,
    SimapModalService,
    WaitingService
    ) {

  $scope.helpBlock = 'Categories let you group your items. Here you can select a category to edit, delete a category, and add a new category.';

  $scope.categories = CategoriesService.getCategories();

  $scope.addNewCategory = function() {
    WaitingService.beginWaiting();
    CategoryService.createNew().then(function(newCategoryId) {
      $scope.editCategory(newCategoryId);
      WaitingService.doneWaiting();
    });
  };

  $scope.editCategory = function(key) {
    $location.path('/category/edit/' + key);
  };

  $scope.removeCategory = function(key) {
    var itemsInCategory = CategoryService.itemsInCategory(key);

    if (itemsInCategory.length > 0) {
      SimapModalService.showError({
        title: 'Can\'t Delete Category',
        msg: 'The category \'' + $scope.categories[key].name +'\' still has items in it. You must move these items to another category before you can delete it.',
        list: itemsInCategory
      });
    } else {
      SimapModalService.confirmAction({
        title: 'Delete Category?',
        msg: 'Are you sure you want to delete the category "' + $scope.categories[key].name + '?" This cannot be undone!'
      }).then(function(confirmed) {
        if (!confirmed) {
          return;
        }

        WaitingService.beginWaiting();
        CategoryService.removeOld(key).then(function() {
          WaitingService.doneWaiting();
        });
      });
    }
  };

}]);
