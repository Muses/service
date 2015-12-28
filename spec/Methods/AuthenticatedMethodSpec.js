'use strict';

var assert = require('assert');
var errors = require('muses-errors');
var service = require('../../lib/');

describe('AuthenticatedMethod', function() {

  it('should be an function', function() {
    expect(typeof service.Methods.AuthenticatedMethod).toEqual('function');
  });

  it('should have default options', function() {
    expect(typeof service.Methods.AuthenticatedMethod.defaultOptions).toEqual('function');
    var defaults = service.Methods.AuthenticatedMethod.defaultOptions();
    expect(typeof defaults).toEqual('object');
    expect(typeof defaults.authenticator).toEqual('function');
  });

  describe('authenticator', function() {
    var fnTruthy = function() { return true; };
    var fnFalsy = function() { return true; };

    var method = new service.Methods.AuthenticatedMethod('test', function() {}, { authenticator: fnTruthy });

    it('should be gettable', function() {
      expect(method.authenticator).toBe(fnTruthy);
    });

    it('should be settable', function() {
      method.authenticator = fnFalsy;
      expect(method.authenticator).toBe(fnFalsy);
    });

    it('should only allow a function', function() {
      var setNumber = function() {
        method.authenticator = 1;
      };
      expect(setNumber).toThrowError(assert.AssertionError, 'authenticator must be a function');
    });
  });

  describe('invoke', function() {

    // Create an echo method.
    var echo = new service.Methods.AuthenticatedMethod(
      'echo',
      function(text) {
        return text;
      }
    );

    it('should be a function', function() {
      expect(typeof echo.invoke).toEqual('function');
    });

    it('should return a promise', function() {
      expect(echo.invoke('Foo') instanceof Promise).toEqual(true);
    });

    it('should reject the promise with the default authenticator', function(done) {
      echo
        .invoke('Foo')
        .then(function(res) {
          done.fail('did not reject promise');
        })
        .catch(function(error) {
          expect(error instanceof errors.Error).toEqual(true);
          expect(error instanceof errors.Unauthorized).toEqual(true);
          expect(error.code).toEqual(401);
          done();
        });
    });

    it('should should execute method if authenticator returns true', function(done) {

      var test = new service.Methods.AuthenticatedMethod(
        'test',
        function(res) {
          return 'Success!';
        },
        {
          authenticator: function() {
            return true;
          }
        }
      );

      test
        .invoke()
        .then(function(res) {
          expect(res).toEqual('Success!');
          done();
        })
        .catch(function(error) {
          done.fail('method rejected');
        });
    });
  });
});
