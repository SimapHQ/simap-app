'use strict';

describe('Service: FirebaseService', function() {

  var FirebaseService;

  beforeEach(function() {
    module('mock.firebase');
    module('simapApp');
  });

  beforeEach(inject(function (_FirebaseService_) {
    FirebaseService = _FirebaseService_;
  }));

  it('should return a firebase reference', function() {
    var ref = FirebaseService.getRef();

    expect(ref).not.toBeUndefined();
  });

});
