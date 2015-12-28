'use strict';

var assert = require('assert');
var errors = require('muses-errors');
var service = require('../../lib/');

describe('Adapter', function() {

  it('should be an function', function() {
    expect(typeof service.Adapters.Adapter).toEqual('function');
  });

  it('should should require a service', function() {

    var throwService = function() {
      return new service.Adapters.Adapter();
    };

    var success = function() {
      var svc = new service.Service('Service1', []);
      return new service.Adapters.Adapter(svc);
    };

    expect(throwService).toThrowError(assert.AssertionError, 'service must be an instance of Service');
    expect(success).not.toThrow();
  });
});
