'use strict';

var app = angular.module('simapApp');

app.controller('CategoriesCtrl', function ($scope, $location) {
  $scope.helpBlock = 'Categories let you group your items. Here you can select a category to edit, delete a category, and add a new category.';

  $scope.categories = ['Vegetables', 'Meats and Proteins', 'Household Supplies'];

  $scope.addNewCategory = function() {
    $location.path('/category/new');
  };

  $scope.editCategory = function() {
    $location.path('/category/edit/categoryid');
  };

  $scope.removeCategory = function() {
    
  };
});
