'use strict';

var app = angular.module('foodStorageTrackerApp');

app.controller('CategoriesCtrl', function ($scope) {

  $scope.categories = ['Vegetables', 'Meats and Proteins', 'Household Supplies'];
  $scope.newCategory = '';

  /**
   * This shouldn't allow you to add a category that already exists.
   */
  $scope.addCategory = function() {
    if ($scope.newCategory === '' || $scope.categories.indexOf($scope.newCategory) !== -1) {
      return;
    }
    $scope.categories.push($scope.newCategory);
    $scope.newCategory = '';
  };

  /**
   * This shouldn't allow you to rename a category to duplicate another.
   * This shouldn't allow you to rename a category to ''.
   */
  $scope.editCategory = function() {
    
  };

  /**
   * This shouldn't let you remove a category that has items in it.
   */
  $scope.removeCategory = function(categoryToRemove) {
    var idxOfCategoryToRemove = $scope.categories.indexOf(categoryToRemove);
    $scope.categories.splice(idxOfCategoryToRemove, 1);
  };

});
