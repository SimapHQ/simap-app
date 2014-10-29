'use strict';

describe('Controller: PlanningCtrl', function () {

  var PlanningCtrl,
      $scope;

  beforeEach(module('simapApp'));

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();

    PlanningCtrl = $controller('PlanningCtrl', {
      $scope: $scope
    });
  }));

  it('should have a help block defined', function() {

  });

  it('should save changes to family size', function() {

  });

  it('should save changes to the storage goal length', function() {

  });

  it('should calculate how long the goal will prepare them for', function() {

  });

});
