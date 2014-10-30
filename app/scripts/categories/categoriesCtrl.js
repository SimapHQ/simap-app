'use strict';

var app = angular.module('simapApp');

app.controller('CategoriesCtrl', ['$scope', '$location', 'randomColor', function ($scope, $location, randomColor) {
  $scope.helpBlock = 'Categories let you group your items. Here you can select a category to edit, delete a category, and add a new category.';

  $scope.categories = {
    'c1': { name: 'Vegetables', color: randomColor() },
    'c2': { name: 'Meats and Proteins', color: randomColor() },
    'c3': { name: 'Household Supplies', color: randomColor() }
  };

  $scope.addNewCategory = function() {
    var newCategoryId = 34;
    $location.path('/category/edit/' + newCategoryId);
  };

  $scope.editCategory = function() {
    $location.path('/category/edit/categoryid');
  };

  $scope.removeCategory = function(key) {
    delete $scope.categories[key];
  };
}]);
