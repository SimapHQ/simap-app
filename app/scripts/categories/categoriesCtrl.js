'use strict';

var app = angular.module('simapApp');

app.controller('CategoriesCtrl', [
  '$location',
  '$scope',
  'CategoryService',
  'ListService',
  function (
    $location,
    $scope,
    CategoryService,
    ListService
    ) {

  $scope.helpBlock = 'Categories let you group your items. Here you can select a category to edit, delete a category, and add a new category.';

  var refresh = function() {
    ListService.getList('categories').then(function(categories) {
      $scope.categories = categories;
    });
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
