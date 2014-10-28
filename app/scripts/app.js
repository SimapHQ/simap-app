'use strict';

/**
 * Main module of the application.
 */
var app = angular.module('simapApp', ['ngAnimate',
                                      'ngCookies',
                                      'ngResource',
                                      'ngRoute',
                                      'ngSanitize',
                                      'ngTouch',
                                      'colorpicker.module',
                                      'firebase']);

app.config(['$routeProvider', '$logProvider', function ($routeProvider, $logProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/home', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      authRequired: true
    })
    .when('/items', {
      templateUrl: 'views/items.html',
      controller: 'ItemsCtrl',
      authRequired: true
    })
    .when('/item/edit/:itemId', {
      templateUrl: 'views/item.html',
      controller: 'ItemCtrl',
      authRequired: true
    })
    .when('/categories', {
      templateUrl: 'views/categories.html',
      controller: 'CategoriesCtrl',
      authRequired: true
    })
    .when('/category/edit/:categoryId', {
      templateUrl: 'views/category.html',
      controller: 'CategoryCtrl',
      authRequired: true
    })
    .when('/planning', {
      templateUrl: 'scripts/planning/planning.html',
      controller: 'PlanningCtrl',
      authRequired: true
    })
    .otherwise({
      redirectTo: '/login'
    });

  $logProvider.debugEnabled(true);
}]);

app.run(['$rootScope', '$location', '$log', 'SessionService', function($rootScope, $location, $log, SessionService) {

  $rootScope.$on('$routeChangeStart', function(event, next) {
    if (next.authRequired && SessionService.currentSession() === null) {
      $location.path('/login');
    } else if ($location.path() === '/login' && SessionService.currentSession() !== null) {
      $log.debug('attempted /login, but already logged in. going /home.');
      $location.path('/home');
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(routeChangeEvent) {
    $log.debug('route change successful.', routeChangeEvent);
  });

  $rootScope.$on('$routeChangeError', function(routeChangeEvent, current, previous, eventObj) {
    $log.error('route change error, sending back to /.', routeChangeEvent, current, previous, eventObj);
    $location.path('/login');
  });

  $rootScope.$on('$firebaseSimpleLogin:login', function(event, user) {
    SessionService.startSession(user);
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    SessionService.closeSession();
    $location.path('/login');
  });

}]);
