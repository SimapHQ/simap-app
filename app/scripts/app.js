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
  '$locationProvider',
  '$logProvider',
  '$routeProvider',
  'PATH_TO_HOME',
  'PATH_TO_LOGIN',
  function (
    $locationProvider,
    $logProvider,
    $routeProvider,
    PATH_TO_HOME,
    PATH_TO_LOGIN
  ) {
  $routeProvider
    .when(PATH_TO_LOGIN, {
      templateUrl: 'scripts/login/login.html',
      controller: 'LoginCtrl'
    })
    .when(PATH_TO_HOME, {
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
      redirectTo: PATH_TO_LOGIN
    });

  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix = '!';

  $logProvider.debugEnabled(true);
}]);

app.run([
  '$location',
  '$log',
  '$q',
  '$rootScope',
  'DataService',
  'LoginService',
  'PATH_TO_HOME',
  'PATH_TO_LOGIN',
  'SessionService',
  'UserService',
  'WaitingService',
  function(
    $location,
    $log,
    $q,
    $rootScope,
    DataService,
    LoginService,
    PATH_TO_HOME,
    PATH_TO_LOGIN,
    SessionService,
    UserService,
    WaitingService
  ) {

  $rootScope.$on('$routeChangeStart', function(event, next) {
    if (next.authRequired && SessionService.currentSession() === null) {
      $location.path(PATH_TO_LOGIN);
    } else if ($location.path() === PATH_TO_LOGIN && SessionService.currentSession() !== null) {
      $location.path(PATH_TO_HOME);
    }
  });

  $rootScope.$on('$routeChangeError', function(routeChangeEvent, current, previous, eventObj) {
    $log.error('route change error, sending back to /.', routeChangeEvent, current, previous, eventObj);
    $location.path(PATH_TO_LOGIN);
  });

  $rootScope.$on('$firebaseSimpleLogin:login', function(event, user) {
    WaitingService.beginWaiting();
    UserService.updateUser(user).then(function() {
      SessionService.startSession(user).then(function() {
        DataService.refreshData().then(function() {
          WaitingService.doneWaiting();
          $location.path(PATH_TO_HOME);
        });
      });
    }, function(error) {
      $log.error('error updating user', user, error);
      LoginService.logout();
    });
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    SessionService.closeSession();
    $location.path(PATH_TO_LOGIN);
  });

  $rootScope.empty = function(value) {
    return $.isEmptyObject(value);
  };

}]);
