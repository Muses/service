'use strict';

var assert = require('assert');
var errors = require('muses-errors');
var lodash = require('lodash');
var Method = require('./Methods/Method');

/**
 * Muses Service Class
 */
class Service {

  /**
   * Instantiate a service.
   *
   * @param {String}       name    The service name.
   * @param {Object|Array} methods The service methods as a hash object or an array of Method instances.
   *
   * @return {Service} A service instance.
   *
   * @throws {assert.AssertionError} If name is not a string.
   * @throws {assert.AssertionError} If methods is not a hash object or an array of Method instances.
   */
  constructor(name, methods) {
    this.name = name;
    this.types = require('./Methods'); // Required at runtime to prevent circular-dependencies.
    this.methods = methods;
  }

  /**
   * Add a method to the service.
   *
   * @param {String|Method} name The method instance or a method name if using the `method` parameter.
   * @param {Object} method A method instance or an object.
   *
   * @return {self}
   *
   * @throws {assert.AssertionError} If method is not an instance of Method.
   */
  add(name, method) {

    // If a tuple of (name, object) were supplied, convert to a method instance.
    if (lodash.isString(name) && lodash.isPlainObject(method)) {
      method = Method.fromObject(name, method);
    }
    else if (name instanceof Method && method === undefined) {
      method = name;
      name = undefined;
    }

    // Assert the method is a Method.
    assert(method instanceof Method, 'method must be an instance of Method');

    // Remove any methods with the same name.
    this._methods = this._methods.filter((fm) => fm.name !== method.name);

    // Register the method.
    method.service = this;
    this._methods.push(method);

    return this;
  }

  /**
   * Invoke a service method.
   *
   * @param {String} name The method name.
   * @param {...}    args The method arguments.
   *
   * @return {Promise} A promise returning the result of invoking the method.
   */
  invoke(name) {

    // Get the method's arguments.
    var args = Array.prototype.slice.call(arguments, 1);

    // Find the method.
    var method = this._methods.find((fm) => fm.name === name);

    // Reject the invocation if the method does not exist.
    if (!method) {
      return Promise.reject(new errors.BadRequest());
    }

    // Invoke the method, returning a promise.
    return method.invoke.apply(method, args);
  }

  /**
   * Get the service's methods.
   *
   * @return {Array<Method>} An array of Method instances.
   */
  get methods() {
    return this._methods;
  }

  /**
   * Set the service's methods.
   *
   * @param {Object|Array} methods The service methods as a hash object or an array of Method instances.
   *
   * @throws {assert.AssertionError} If methods is not a hash object or an array of Method instances.
   */
  set methods(methods) {

    // Assert methods is an array of Method instances or a hash object.
    if (lodash.isArray(methods)) {
      if (~(methods.map((method) => method instanceof Method).indexOf(false))) {
        throw new assert.AssertionError({ message: 'methods array must contain only Method instances' });
      }
    }
    // Convert hash object to Method instances.
    else {
      assert(lodash.isPlainObject(methods), 'methods object must be an array of Method instances or plain object');

      // Convert hash object to array of Methods.
      var objects = methods;
      methods = [];
      lodash.forOwn(objects, (object, name) => {
        methods.push(Method.fromObject(name, object));
      });
    }

    // Reset methods.
    this._methods = [];

    // Add the methods.
    methods.forEach((method) => this.add(method));
  }

  /**
   * Get the service's method types.
   *
   * @return {Object} The service's method types.
   */
  get types() {
    return this._types;
  }

  /**
   * Set the service's method types.
   *
   * @param {Object} types The new method types.
   *
   * @throws {assert.AssertionError} If method types is not a plain object.
   */
  set types(types) {
    assert(lodash.isPlainObject(types), 'types must be a plain object');
    this._types = types;
  }

  /**
   * Get the service's name.
   *
   * @return {String} The service's name.
   */
  get name() {
    return this._name;
  }

  /**
   * Set the service's name.
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

module.exports = exports = Service;
