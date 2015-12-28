'use strict';

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

  describe('add', function() {

    var srv = new service.Service('test', []);
    var methInst = new service.Methods.Method('test', function() {});
    var methObj = {
      type: service.Methods.Method,
      impl: function() {}
    };

    it('should be a function', function() {
      expect(typeof srv.add).toBe('function');
    });

    it('should add a method instance to the service', function() {
      var srv = new service.Service('test', []);
      expect(srv.methods.length).toEqual(0);
      srv.add(methInst);
      expect(srv.methods.length).toEqual(1);
      expect(srv.methods.indexOf(methInst)).toBeGreaterThan(-1);
    });

    it('should add a method instance to the service', function() {
      var srv = new service.Service('test', []);
      expect(srv.methods.length).toEqual(0);
      srv.add(methInst);
      expect(srv.methods.length).toEqual(1);
      expect(srv.methods.indexOf(methInst)).toBeGreaterThan(-1);
    });

    it('should add a method name and object to the service', function() {
      var srv = new service.Service('test', []);
      expect(srv.methods.length).toEqual(0);
      srv.add('test', methObj);
      expect(srv.methods.length).toEqual(1);
      expect(srv.methods.filter((m) => m.name === 'test').length).toBe(1);
    });
  });

  describe('invoke', function() {

    var srv = new service.Service('test', [
      new service.Methods.Method('test', function() {})
    ]);

    it('should be a function', function() {
      expect(typeof srv.invoke).toBe('function');
    });

    it('should call a valid named method, returning a promise', function() {
      expect(srv.invoke('test') instanceof Promise).toBe(true);
    });

    it('should reject invocation of invalid methods, returning a rejected promise with a BadRequest error', function(done) {
      var res = srv.invoke('bad');
      expect(res instanceof Promise).toBeTruthy();
      res
        .then(function() {
          done.fail('promise resolved, not rejected');
        })
        .catch(function(result) {
          expect(result instanceof errors.ClientError).toBeTruthy();
          expect(result.message).toEqual('Bad Request');
          expect(result.code).toEqual(400);
          done();
        });
    });
  });
});
