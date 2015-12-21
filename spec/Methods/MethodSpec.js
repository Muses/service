
var assert = require('assert');
var errors = require('muses-errors');
var service = require('../../lib/');

describe('Method', function() {

  it('should be an function', function() {
    expect(typeof service.Methods.Method).toEqual('function');
  });

  it('should have default options', function() {
    expect(typeof service.Methods.Method.defaultOptions).toEqual('function');
    expect(typeof service.Methods.Method.defaultOptions()).toEqual('object');
  });

  it('should should require a name and an implementation', function() {

    var throwName = function() {
      return new service.Methods.Method();
    };

    var throwImplementation = function() {
      return new service.Methods.Method('test');
    };

    var success = function() {
      return new service.Methods.Method('test', function() {});
    };

    expect(throwName).toThrowError(assert.AssertionError, 'name must be a string');
    expect(throwImplementation).toThrowError(assert.AssertionError, 'implementation must be a function');
    expect(success).not.toThrow();
  });

  describe('name', function() {

    var method = new service.Methods.Method('test', function() {});

    it('should be gettable', function() {
      expect(method.name).toBe('test');
    });

    it('should be settable', function() {
      method.name = 'foo';
      expect(method.name).toBe('foo');
    });

    it('should only allow a string', function() {
      var setNumber = function() {
        method.name = 1;
      };
      expect(setNumber).toThrowError(assert.AssertionError, 'name must be a string');
    });
  });

  describe('implementation', function() {
    var fnTruthy = function() { return true; };
    var fnFalsy = function() { return true; };

    var method = new service.Methods.Method('test', fnTruthy);

    it('should be gettable', function() {
      expect(method.implementation).toBe(fnTruthy);
    });

    it('should be settable', function() {
      method.implementation = fnFalsy;
      expect(method.implementation).toBe(fnFalsy);
    });

    it('should only allow a function', function() {
      var setNumber = function() {
        method.implementation = 1;
      };
      expect(setNumber).toThrowError(assert.AssertionError, 'implementation must be a function');
    });
  });

  describe('options', function() {
    var optsTruthy = { foo: true };
    var optsFalsy = { foo: false };

    var method = new service.Methods.Method('test', function() {}, optsTruthy);

    it('should be gettable', function() {
      expect(method.options).toEqual(optsTruthy);
    });

    it('should be settable', function() {
      method.options = optsFalsy;
      expect(method.options).toEqual(optsFalsy);
    });

    it('should only allow an object', function() {
      var setNumber = function() {
        method.options = 1;
      };
      expect(setNumber).toThrowError(assert.AssertionError, 'options must be an object');
    });

    it('should set method\'s own properties on method', function() {
      var optsWithName = { name: 'renamed' };
      method.options = optsWithName;
      expect(method.name).toEqual('renamed');
      expect(method.options.name).toBeUndefined(undefined);
    });
  });

  describe('service', function() {

    var method = new service.Methods.Method('test', function() {});
    var svc = new service.Service('Service', []);

    it('should be settable', function() {
      method.service = svc;
      expect(method.service).toBe(svc);
    });

    it('should be gettable', function() {
      expect(method.service).toBe(svc);
    });

    it('should only allow a Service', function() {
      var setNumber = function() {
        method.service = 1;
      };
      expect(setNumber).toThrowError(assert.AssertionError, 'service must be an instance of Service');
    });
  });

  describe('invoke', function() {

    // Create an echo method.
    var echo = new service.Methods.Method(
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

    it('should fulfill a promise on success', function(done) {
      echo
        .invoke('Foo')
        .then(function(res) {
          expect(res).toEqual('Foo');
          done();
        })
        .catch(function(error) {
          done.fail('promise rejected');
        });
    });

    it('should reject promise with NotFound error on null', function(done) {

      // Create a notFound method.
      var notFound = new service.Methods.Method(
        'notFound',
        function() {
          return null;
        }
      );

      notFound
        .invoke()
        .then(function(res) {
          done.fail('promise should be rejected');
        })
        .catch(function(error) {
          expect(error instanceof errors.NotFound).toEqual(true);
          done();
        });
    });

    it('should reject a promise on error', function(done) {

      // Create a reject method.
      var reject = new service.Methods.Method(
        'reject',
        function() {
          throw new errors.Error('Nope');
        }
      );

      reject
        .invoke()
        .then(function(res) {
          done.fail('promise should be rejected');
        })
        .catch(function(error) {
          expect(error.message).toEqual('Nope');
          done();
        });
    });

    it('should pass on all arguments plus itself', function(done) {

      // Create a method to count it's arguments.
      var counter = new service.Methods.Method(
        'counter',
        function() {
          return arguments.length;
        }
      );

      counter.invoke(1, 2, 3).then(function(res) {
        expect(res).toEqual(4);
        done();
      });
    });
  });
});
