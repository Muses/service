
var assert = require('assert');
var errors = require('muses-errors');
var service = require('../lib/');

describe('Method', function() {

  it('should be an function', function() {
    expect(typeof service.Types.Method).toEqual('function');
  });

  it('should have default options', function() {
    expect(typeof service.Types.Method.defaultOptions).toEqual('function');
    expect(typeof service.Types.Method.defaultOptions()).toEqual('object');
  });

  it('should should require a name and an implementation', function() {

    var throwName = function() {
      return new service.Types.Method();
    };

    var throwImplementation = function() {
      return new service.Types.Method('test');
    };

    var success = function() {
      return new service.Types.Method('test', function() {});
    };

    expect(throwName).toThrowError(assert.AssertionError, 'name must be a string');
    expect(throwImplementation).toThrowError(assert.AssertionError, 'implementation must be a function');
    expect(success).not.toThrow();
  });
});
