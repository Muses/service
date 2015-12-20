
var assert = require('assert');
var errors = require('muses-errors');
var Method = require('../lib/Method');

describe('Method', function() {

  it('should be an function', function() {
    expect(typeof Method).toEqual('function');
  });

  it('should have default options', function() {
    expect(typeof Method.defaultOptions).toEqual('function');
    expect(typeof Method.defaultOptions()).toEqual('object');
  });

  it('should should require a name and an implementation', function() {

    var throwName = function() {
      return new Method();
    };

    var throwImplementation = function() {
      return new Method('test');
    };

    var success = function() {
      return new Method('test', function() {});
    };

    expect(throwName).toThrowError(assert.AssertionError, 'name must be a string');
    expect(throwImplementation).toThrowError(assert.AssertionError, 'implementation must be a function');
    expect(success).not.toThrow();
  });
});
