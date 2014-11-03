'use strict';

describe('Service: FirebaseService', function() {

  var $firebase,
      $firebaseResult,
      $firebaseObj;

  var FirebaseService;

  beforeEach(function() {
    module('mock.firebase');
    module('simapApp')
  });

  beforeEach(module('simapApp', function($provide) {
    $firebaseObj = { key1: 'v1' };

    $firebaseResult = jasmine.createSpyObj('$firebaseResult', ['$asObject']);
    $firebaseResult.$asObject.and.returnValue($firebaseObj);

    $firebase = jasmine.createSpy('$firebase').and.returnValue($firebaseResult);

    $provide.value('$firebase', $firebase);
  }));

  beforeEach(inject(function (_FirebaseService_) {
    FirebaseService = _FirebaseService_;
  }));

  describe('getRef', function() {
    it('should return a firebase reference', function() {
      var ref = FirebaseService.getRef();

      expect(ref).not.toBeUndefined();
    });
  });

  describe('getObject', function() {
    it('should return the result of calling $asObject on a $firebase', function() {
      expect(FirebaseService.getObject('some/path')).toBe($firebaseObj);
    });
  });



});
