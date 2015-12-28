'use strict';

var assert = require('assert');
var lodash = require('lodash');
var Service = require('./Service');

/**
 * Muses Service Object Class
 */
class ServiceObject {

  /**
   * Get the object's options.
   *
   * @return {Object} The object's options.
   */
  get options() {
    return this._options;
  }

  /**
   * Set the object's options.
   *
   * @param {Object} options The new options.
   *
   * @throws {assert.AssertionError} If options is not an object.
   */
  set options(options) {
    assert(lodash.isPlainObject(options), 'options must be an object');

    // Apply the options.
    this._options = {};
    lodash.forOwn(options, (value, key) => {
      // Get the property descriptor for the key.
      var descriptor = Object.getOwnPropertyDescriptor(this.constructor.prototype, key);

      // If the class has a property with a setter for that key, use the setter; otherwise, push into _options.
      if (descriptor && lodash.isFunction(descriptor.set)) {
        this[key] = value;
      }
      else {
        this._options[key] = value;
      }
    });
  }

  /**
   * Get the object's service.
   *
   * @return {Service} The object's attached service.
   */
  get service() {
    return this._service;
  }

  /**
   * Set the object's service.
   *
   * @param {Service} service The service instance.
   *
   * @throws {assert.AssertionError} If service is not an instance of Service.
   */
  set service(service) {
    assert(service instanceof Service, 'service must be an instance of Service');
    this._service = service;
  }
}

module.exports = exports = ServiceObject;
