'use strict';

var app = angular.module('simapApp');

app.service('WaitingService', [
  '$log',
  function(
    $log
  ) {

  var waitingSemaphore = 0;

  this.beginWaiting = function() {
    waitingSemaphore += 1;
  };

  this.doneWaiting = function() {
    waitingSemaphore -= 1;

    if (waitingSemaphore < 0) {
      $log.error('waitingSemaphore is < 0. do you have a doneWaiting call to match each beginWaiting?', waitingSemaphore);
    }
  };

  this.isWaiting = function() {
    return waitingSemaphore > 0;
  };

}]);
