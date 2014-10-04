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

var bouncer = app.controller('BouncerCtrl');

app.config(['$routeProvider', '$logProvider', function ($routeProvider, $logProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/home', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        user: bouncer.checkGuest
      }
    })
    .when('/items', {
      templateUrl: 'views/items.html',
      controller: 'ItemsCtrl',
      resolve: {
        user: bouncer.checkGuest
      }
    })
    .when('/item/edit/:itemId', {
      templateUrl: 'views/item.html',
      controller: 'ItemCtrl',
      resolve: {
        user: bouncer.checkGuest
      }
    })
    .when('/categories', {
      templateUrl: 'views/categories.html',
      controller: 'CategoriesCtrl',
      resolve: {
        user: bouncer.checkGuest
      }
    })
    .when('/category/edit/:categoryId', {
      templateUrl: 'views/category.html',
      controller: 'CategoryCtrl',
      resolve: {
        user: bouncer.checkGuest
      }
    })
    .when('/planning', {
      templateUrl: 'views/planning.html',
      controller: 'PlanningCtrl',
      resolve: {
        user: bouncer.checkGuest
      }
    })
    .otherwise({
      redirectTo: '/login'
    });

  $logProvider.debugEnabled(true);
}]);

bouncer.checkGuest = ['$q', '$log', 'AuthService', function($q, $log, AuthService) {
  return AuthService.getCurrentUser().then(function(user) {
    return user;
  }, function(error) {
    return $q.reject(error);
  });
}];

app.run(['$rootScope', '$location', '$log', 'AuthService', function($rootScope, $location, $log, AuthService) {

  $rootScope.$on('$routeChangeStart', function() {
    if ($location.path() === '/login' && AuthService.isLoggedIn()) {
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

}]);
