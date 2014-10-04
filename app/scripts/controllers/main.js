'use strict';

angular.module('simapApp').controller('MainCtrl', ['$scope', 'randomColor', function ($scope, randomColor) {
  
  $scope.progressHelp = 'Here you can see your overall progress towards your goal. The progress bar indicates how what percentage of your storage goal is met by rationed items in each category.';
  $scope.categoryHelp = 'Here you can see your progress towards your goal for each category, as well as for each individual item.';

  $scope.progressItems = {
    'one': {
      color: randomColor(),
      width: 0.17
    },
    'two': {
      color: randomColor(),
      width: 0.23
    },
    'three': {
      color: randomColor(),
      width: 0.28
    }
  };

  $scope.itemUnits = {
    'l24kj3er': { name: 'cup' },
    'lkj2lkf': { name: '16oz can' },
    'l43krfef': { name: '12oz can' }
  };

  $scope.updateUnits = $scope.itemUnits.l24kj3er;
  $scope.updateAmount = 1;

  $scope.categories = {
    'one': {
      name: 'Vegetables',
      items: {
        'ldfkjs': {
          name: 'Corn',
          amount: 11,
          units: 'cans'
        },
        'k2lfls': {
          name: 'Green Beans',
          amount: 11,
          units: 'cans'
        },
        'sdklef': {
          name: 'Carrots',
          amount: 11,
          units: 'cans'
        }
      }
    },
    'two': {
      name: 'Meats/Proteins',
      items: {
        'ldfkjs': {
          name: 'White Beans',
          amount: 11,
          units: 'cans'
        },
        'k2lfls': {
          name: 'Ground Beef',
          amount: 11,
          units: 'cans'
        },
        'sdklef': {
          name: 'Pinto Beans',
          amount: 4,
          units: 'jars'
        }
      }
    },
    'three': {
      name: 'Grains',
      items: {
        'ldfkjs': {
          name: 'Hard Red Wheat',
          amount: 11,
          units: 'cans'
        },
        'k2lfls': {
          name: 'Flour',
          amount: 11,
          units: 'cans'
        },
        'sdklef': {
          name: 'Rice',
          amount: 11,
          units: 'cans'
        }
      }
    },
    'four': {
      name: 'Household Supplies',
      items: {
        'ldfkjs': {
          name: 'Toilet Paper',
          amount: 11,
          units: 'cans'
        },
        'k2lfls': {
          name: 'Toothpaste',
          amount: 11,
          units: 'cans'
        },
        'sdklef': {
          name: 'Aluminum Foil',
          amount: 11,
          units: 'cans'
        }
      }
    }
  };

}]);
