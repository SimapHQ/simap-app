'use strict';

angular.module('foodStorageTrackerApp').controller('ItemCtrl', function ($scope) {
  $scope.item = {
    units: [
      { name: "cup", masterUnits: 1 },
      { name: "lb", masterUnits: 25 }
    ]
  };

  $scope.addUnit = function() {
    if (!$scope.newUnitName || $scope.newUnitName === '' ||
        !$scope.newUnitMasterUnits || $scope.newUnitMasterUnits === '') {
      return;
    }

    $scope.item.units.push({
      name: $scope.newUnitName,
      masterUnits: $scope.newUnitMasterUnits
    });

    $scope.newUnitName = '';
    $scope.newUnitMasterUnits = '';
  };
});
