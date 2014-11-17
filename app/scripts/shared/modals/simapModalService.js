'use strict';

var app = angular.module('simapApp');

app.service('SimapModalService', [
  '$q',
  'ModalService',
  function(
    $q,
    ModalService
  ) {

  var _confirmAction = function(actionObj) {
    var deferred = $q.defer();

    ModalService.showModal({
      templateUrl: 'views/templates/modals/confirm.html',
      controller: 'ConfirmModalCtrl',
      inputs: {
        data: actionObj
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(confirmed) {
        // This is a hack, for some reason the modla service isn't cleaning it up.
        $('.modal-backdrop').remove();

        deferred.resolve(confirmed);
      });
    });

    return deferred.promise;
  };

  this.showError = function(errorObj) {
    ModalService.showModal({
      templateUrl: 'views/templates/modals/error.html',
      controller: 'ErrorModalCtrl',
      inputs: {
        data: errorObj
      }
    }).then(function(modal) {
      modal.element.modal();
    });
  };

  this.confirmAction = _confirmAction;

  this.confirmNavigation = function() {
    return _confirmAction({
      title: 'Abandon Changes?',
      msg: 'You haven\'t saved your changes yet! Are you sure you want to leave this page?'
    });
  };

}]);
