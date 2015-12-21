
var assert = require('assert');
var errors = require('muses-errors');
var service = require('../lib/');

describe('Service', function() {

  it('should be an function', function() {
    expect(typeof service.Service).toEqual('function');
  });

  it('should should require a name and methods', function() {

    var throwName = function() {
      return new service.Service();
    };

    var throwMethods = function() {
      return new service.Service('test');
    };

    var throwMethodsMember = function() {
      return new service.Service('test', [ {} ]);
    };

    var successObject = function() {
      return new service.Service('test', {
        test: {
          type: service.Methods.Method,
          impl: function() {}
        }
      });
    };

    var successArray = function() {
      return new service.Service('test', [
        new service.Methods.Method('test', function() {})
      ]);
    };

    expect(throwName).toThrowError(assert.AssertionError, 'name must be a string');
    expect(throwMethods).toThrowError(assert.AssertionError, 'methods object must be an array of Method instances or plain object');
    expect(throwMethodsMember).toThrowError(assert.AssertionError, 'methods array must contain only Method instances');
    expect(successObject).not.toThrow();
    expect(successArray).not.toThrow();
  });
});
