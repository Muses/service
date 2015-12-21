
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

  describe('service', function() {

    var svc1 = new service.Service('Service1', []);
    var svc2 = new service.Service('Service2', []);
    var method = new service.Adapters.Adapter(svc1);

    it('should be gettable', function() {
      expect(method.service).toBe(svc1);
    });

    it('should be settable', function() {
      method.service = svc2;
      expect(method.service).toBe(svc2);
    });

    it('should only allow a Service', function() {
      var setNumber = function() {
        method.service = 1;
      };
      expect(setNumber).toThrowError(assert.AssertionError, 'service must be an instance of Service');
    });
  });
});
