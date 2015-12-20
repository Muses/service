'use strict';

var assert = require('assert');
var errors = require('muses-errors');
var lodash = require('lodash');
var Service = require('./Service');

/**
 * Muses Service Method Class
 */
class Method {

  /**
   * The default method options.
   *
   * @type {Object}
   */
  static defaultOptions() {
    return {};
  };

  /**
   * Instantiate a method.
   *
   * @param {String}   name           The method name.
   * @param {Function} implementation The method implementation.
   * @param {Object}   options        The method options.
   *
   * @return {Method} A method instance.
   *
   * @throws {assert.AssertionError} If name is not a string.
   * @throws {assert.AssertionError} If implementation is not a function.
   */
  constructor(name, implementation, options) {
    this.name = name;
    this.implementation = implementation;
    this.options = lodash.defaultsDeep({}, options, Method.defaultOptions());
  }

  /**
   * Invoke the method.
   *
   * @param {...} args The method arguments.
   *
   * @return {Promise} A promise returning the result of invoking the method.
   */
  invoke() {

    // Get the method's arguments.
    var args = Array.prototype.slice.call(arguments);

    // Add this as the last argument, if not already present.
    if (args[args.length - 1] !== this) {
      args.push(this);
    }

    // Invoke the method handler.
    return new Promise((resolve, reject) => {

      // Call the method implementation.
      var res = this.implementation.apply(this, args);

      // Reject the promise if an error was returned.
      // Throwing an error inside the implementation will automatically reject the promise.
      if (res instanceof Error) {
        return reject(res);
      }
      // Reject the promise with a NotFound error if null was returned.
      else if (res === null) {
        return reject(new errors.NotFound());
      }

      // Fulfill the promise.
      return resolve(res);
    });
  }

  /**
   * Get the method's service.
   *
   * @return {Service} The method's attached service.
   */
  get service() {
    return this._service;
  }

  /**
   * Set the method's service.
   *
   * @param {Service} service The service instance.
   *
   * @throws {assert.AssertionError} If server is not an instance of Service.
   */
  set service(service) {
    assert(service instanceof Service.constructor, 'service must be an instance of Service');
    this._service = service;
  }

  /**
   * Get the method's implementation.
   *
   * @return {String} The method's implementation.
   */
  get implementation() {
    return this._implementation;
  }

  /**
   * Set the method's implementation.
   *
   * @param {String} implementation The new implementation.
   *
   * @throws {assert.AssertionError} If implementation is not a function.
   */
  set implementation(implementation) {
    assert(lodash.isFunction(implementation), 'implementation must be a function');
    this._implementation = implementation;
  }

  /**
   * Get the method's name.
   *
   * @return {String} The method's name.
   */
  get name() {
    return this._name;
  }

  /**
   * Set the method's name.
   *
   * @param {String} name The new name.
   *
   * @throws {assert.AssertionError} If name is not a string.
   */
  set name(name) {
    assert(lodash.isString(name), 'name must be a string');
    this._name = name;
  }

  /**
   * Get the method's options.
   *
   * @return {Object} The method's options.
   */
  get options() {
    return this._options;
  }

  /**
   * Set the method's options.
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
      this[key] = value;
    });
  }
}

module.exports = exports = Method;
