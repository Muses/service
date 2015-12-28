'use strict';

var assert = require('assert');
var errors = require('muses-errors');
var lodash = require('lodash');
var Service = require('../Service');
var ServiceObject = require('../ServiceObject');

/**
 * Muses Service Method Class
 */
class Method extends ServiceObject {

  /**
   * The default method options.
   *
   * @type {Object}
   */
  static defaultOptions() {
    return {};
  }

  /**
   * Create a Method from a plain object.
   *
   * @param {String} name   The method name.
   * @param {Object} object The input object.
   *
   * @return {Method} The method.
   *
   * @throws {assert.AssertionError} If name is not a string.
   * @throws {assert.AssertionError} If object is not a plain object.
   * @throws {assert.AssertionError} If object.type is not a string or a constructor with Method in the prototype chain.
   * @throws {assert.AssertionError} If object.impl is not a function.
   * @throws {assert.AssertionError} If object.type not valid.
   */
  static fromObject(name, object) {

    // Assert the arguments have the correct structure.
    assert(lodash.isString(name), 'name must be a string');
    assert(lodash.isPlainObject(object), 'object must be a plain object');
    assert(
      lodash.isString(object.type) || object.type === Method || Method.isPrototypeOf(object.type),
      'type must be a string or a constructor with Method in the prototype chain.'
    );

    // Get the method implementation.
    var impl = object.impl;
    assert(lodash.isFunction(object.impl), 'impl must be a function');

    // Get the method type.
    var Type = (object.type === Method || Method.isPrototypeOf(object.type)) ? object.type : this.types[object.type];
    assert(Type === Method || Method.isPrototypeOf(Type), `invalid method type: ${object.type}`);

    // Delete special properties.
    var options = lodash.omit(object, [ 'type', 'impl', 'name' ]);

    // Instantiate the method.
    var method = new Type(name, impl, options);

    return method;
  }

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
    super();
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
}

module.exports = exports = Method;
