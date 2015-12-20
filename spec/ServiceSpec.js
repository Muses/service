
var assert = require('assert');
var errors = require('muses-errors');
var Method = require('../lib/Method');
var Service = require('../lib/Service');

describe('Service', function() {

  it('should be an function', function() {
    expect(typeof Service).toEqual('function');
  });

  it('should should require a name and methods', function() {

    var throwName = function() {
      return new Service();
    };

    var throwMethods = function() {
      return new Service('test');
    };

    var throwMethodsMember = function() {
      return new Service('test', [ {} ]);
    };

    var successObject = function() {
      return new Service('test', {});
    };

    var successArray = function() {
      return new Service('test', [ new Method('test', function() {}) ]);
    };

    expect(throwName).toThrowError(assert.AssertionError, 'name must be a string');
    expect(throwMethods).toThrowError(assert.AssertionError, 'methods object must be an array of Method instances or plain object');
    expect(throwMethodsMember).toThrowError(assert.AssertionError, 'methods array must contain only Method instances');
    expect(successObject).not.toThrow();
    expect(successArray).not.toThrow();
  });
});
