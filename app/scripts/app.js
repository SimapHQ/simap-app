'use strict';

/**
 * Main module of the application.
 */
angular.module('simapApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'colorpicker.module'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/items', {
        templateUrl: 'views/items.html',
        controller: 'ItemsCtrl'
      })
      .when('/categories', {
        templateUrl: 'views/categories.html',
        controller: 'CategoriesCtrl'
      })
      .when('/category/edit/:categoryId', {
        templateUrl: 'views/category.html',
        controller: 'CategoryCtrl'
      })
      .when('/planning', {
        templateUrl: 'views/planning.html',
        controller: 'PlanningCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
