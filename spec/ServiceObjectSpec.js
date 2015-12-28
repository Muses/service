'use strict';

var assert = require('assert');
var lodash = require('lodash');
var errors = require('muses-errors');
var Service = require('../lib/Service');
var ServiceObject = require('../lib/ServiceObject');

class ExtObject extends ServiceObject {
  get name() {
    return this._name;
  }
  set name(name) {
    assert(lodash.isString(name), 'name must be a string');
    this._name = name;
  }
}

describe('Method', function() {

  it('should be an function', function() {
    expect(typeof ServiceObject).toEqual('function');
  });

  describe('options', function() {
    var optsTruthy = { foo: true };
    var optsFalsy = { foo: false };

    var obj = new ServiceObject();

    it('should be settable', function() {
      obj.options = optsFalsy;
      expect(obj.options).toEqual(optsFalsy);
    });

    it('should be gettable', function() {
      obj.options = optsTruthy;
      expect(obj.options).toEqual(optsTruthy);
    });

    it('should only allow an object', function() {
      var setNumber = function() {
        obj.options = 1;
      };
      expect(setNumber).toThrowError(assert.AssertionError, 'options must be an object');
    });

    it('should set obj\'s own properties on obj', function() {
      var ext = new ExtObject();
      var optsWithName = { name: 'renamed' };
      ext.options = optsWithName;
      expect(ext.name).toEqual('renamed');
      expect(ext.options.name).toBeUndefined(undefined);
    });
  });

  describe('service', function() {

    var obj = new ServiceObject();
    var svc = new Service('Service', []);

    it('should be settable', function() {
      obj.service = svc;
      expect(obj.service).toBe(svc);
    });

    it('should be gettable', function() {
      expect(obj.service).toBe(svc);
    });

    it('should only allow a Service', function() {
      var setNumber = function() {
        obj.service = 1;
      };
      expect(setNumber).toThrowError(assert.AssertionError, 'service must be an instance of Service');
    });
  });
});
