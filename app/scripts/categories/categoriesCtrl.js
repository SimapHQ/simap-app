'use strict';

var app = angular.module('simapApp');

app.controller('CategoriesCtrl', [
  '$location',
  '$scope',
  'CategoriesService',
  'CategoryService',
  'WaitingService',
  function (
    $location,
    $scope,
    CategoriesService,
    CategoryService,
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
    WaitingService.beginWaiting();
    CategoryService.removeOld(key).then(function() {
      WaitingService.doneWaiting();
    });
  };

}]);
