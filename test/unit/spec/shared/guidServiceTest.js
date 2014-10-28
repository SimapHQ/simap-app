'use strict';

describe('Service: GuidService', function() {

  var GuidService,
      $scope,
      $location,
      $log;

  beforeEach(function() {
    module('mock.firebase');
    module('simapApp');
  });

  beforeEach(inject(function (_GuidService_) {
    GuidService = _GuidService_;
  }));

  it('should generate a 36-character string guid', function() {
    var guid = GuidService.generateGuid();

    expect(guid.length).toBe(36);
    expect(guid).toEqual(jasmine.any(String));
  });

  it('should generate a different guid each time', function() {
    var guid1 = GuidService.generateGuid(),
        guid2 = GuidService.generateGuid();

    expect(guid1).not.toBe(guid2);
  });
  
});
