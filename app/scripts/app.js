'use strict';

/**
 * Main module of the application.
 */
var app = angular.module('simapApp', [
  'angularModalService',
  'angularSpinner',
  'angulartics',
  'angulartics.google.analytics',
  'colorpicker.module',
  'firebase',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch'
]);

app.config([
  '$logProvider',
  '$routeProvider',
  function (
    $logProvider,
    $routeProvider
  ) {
  $routeProvider
    .when('/login', {
      templateUrl: 'scripts/login/login.html',
      controller: 'LoginCtrl'
    })
    .when('/home', {
      templateUrl: 'scripts/home/home.html',
      controller: 'HomeCtrl',
      authRequired: true
    })
    .when('/items', {
      templateUrl: 'scripts/items/items.html',
      controller: 'ItemsCtrl',
      authRequired: true
    })
    .when('/item/edit/:itemId', {
      templateUrl: 'scripts/items/item.html',
      controller: 'ItemCtrl',
      authRequired: true
    })
    .when('/categories', {
      templateUrl: 'scripts/categories/categories.html',
      controller: 'CategoriesCtrl',
      authRequired: true
    })
    .when('/category/edit/:categoryId', {
      templateUrl: 'scripts/categories/category.html',
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

app.run([
  '$location',
  '$log',
  '$q',
  '$rootScope',
  'CategoriesService',
  'HOME',
  'ItemsService',
  'LoginService',
  'SessionService',
  'UserService',
  'WaitingService',
  function(
    $location,
    $log,
    $q,
    $rootScope,
    CategoriesService,
    HOME,
    ItemsService,
    LoginService,
    SessionService,
    UserService,
    WaitingService
  ) {

  $rootScope.$on('$routeChangeStart', function(event, next) {
    if (next.authRequired && SessionService.currentSession() === null) {
      $location.path('/login');
    } else if ($location.path() === '/login' && SessionService.currentSession() !== null) {
      $location.path('/home');
    }
  });

  $rootScope.$on('$routeChangeError', function(routeChangeEvent, current, previous, eventObj) {
    $log.error('route change error, sending back to /.', routeChangeEvent, current, previous, eventObj);
    $location.path('/login');
  });

  $rootScope.$on('$firebaseSimpleLogin:login', function(event, user) {
    WaitingService.beginWaiting();
    UserService.updateUser(user).then(function() {
      SessionService.startSession(user).then(function() {
        $q.all([
          CategoriesService.refreshCategories(),
          ItemsService.refreshItems()
        ]).then(function() {
          WaitingService.doneWaiting();
          $location.path(HOME);
        });
      });
    }, function(error) {
      $log.error('error updating user', user, error);
      LoginService.logout();
    });
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    SessionService.closeSession();
    $location.path('/login');
  });

  $rootScope.empty = function(value) {
    return $.isEmptyObject(value);
  };

}]);
