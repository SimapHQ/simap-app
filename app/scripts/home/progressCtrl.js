'use strict';

angular.module('simapApp').controller('ProgressCtrl', [
  '$scope',
  'DataService',
  'ITEM_AMOUNT_CHANGED_EVENT',
  'ProgressService',
  function (
    $scope,
    DataService,
    ITEM_AMOUNT_CHANGED_EVENT,
    ProgressService
  ) {

  var refreshProgressBars = function() {
    $scope.overallProgressBarItems = ProgressService.getOverallProgressBarItems();
    $scope.progressBarItems = {};

    Object.keys(DataService.getData().categories).forEach(function(categoryId) {
      $scope.progressBarItems[categoryId] = ProgressService.getCategoryProgressBarItems(categoryId);
    });
  };

  $scope.baselinesMet = function() {
    return ProgressService.countMetBaselines($scope.categoryId);
  };

  $scope.totalBaselines = function() {
    return ProgressService.countTotalBaselines($scope.categoryId);
  };

  $scope.rationProgress = function() {
    return ProgressService.calculateRationProgress($scope.categoryId) * 100;
  };

  $scope.$on(ITEM_AMOUNT_CHANGED_EVENT, function() {
    refreshProgressBars();
  });

  refreshProgressBars();

}]);
