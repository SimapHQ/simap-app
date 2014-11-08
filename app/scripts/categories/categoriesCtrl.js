'use strict';

var app = angular.module('simapApp');

app.controller('CategoriesCtrl', [
  '$location',
  '$scope',
  'CategoryService',
  function (
    $location,
    $scope,
    CategoryService
    ) {

  $scope.helpBlock = 'Categories let you group your items. Here you can select a category to edit, delete a category, and add a new category.';

  var refresh = function() {
    $scope.categories = CategoryService.getCategories();
  };

  $scope.addNewCategory = function() {
    CategoryService.createNew().then(function(newCategoryId) {
      $scope.editCategory(newCategoryId);
    });
  };

  $scope.editCategory = function(key) {
    $location.path('/category/edit/' + key);
  };

  $scope.removeCategory = function(key) {
    CategoryService.removeOld(key).then(function() {
      refresh();
    });
  };

  refresh();
}]);
