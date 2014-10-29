'use strict';

describe('Service: randomColor', function() {

  var randomColor;

  beforeEach(function() {
    module('simapApp');
  });

  beforeEach(inject(function (_randomColor_) {
    randomColor = _randomColor_;
  }));

  it('should generate a valid hexadecimal color string', function() {
    var color = randomColor();

    expect(color).toMatch(/^#[a-f0-9]{6}$/);
  });

});
