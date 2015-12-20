'use strict';

var assert = require('assert');
var errors = require('muses-errors');
var lodash = require('lodash');
var Method = require('./Method');

/**
 * Muses Service Authenticated Method Class
 */
class AuthenticatedMethod extends Method {

  /**
   * The default method options.
   *
   * @type {Object}
   */
  static defaultOptions() {
    return {
      authenticator: AuthenticatedMethod.defaultAuthenticator
    };
  };

  /**
   * The default method authenticator.
   *
   * @param {...} args The method arguments.
   *
   * @return {Boolean} The default authenticator always returns false.
   */
  static defaultAuthenticator() {
    return false;
  }

  /**
   * Instantiate an authenticated method.
   *
   * @param {String}   name           The method name.
   * @param {Function} implementation The method implementation.
   * @param {Object}   options        The method options.
   *
   * @return {AuthenticatedMethod} An authenticated method instance.
   *
   * @throws {assert.AssertionError} If name is not a string.
   * @throws {assert.AssertionError} If implementation is not a function.
   */
  constructor(name, implementation, options) {
    super(
      name,
      implementation,
      lodash.defaultsDeep({}, options, AuthenticatedMethod.defaultOptions())
    );
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

    // Handle authentication if necessary.
    if (!this.authenticator.apply(this, args)) {
      return Promise.reject(new errors.Unauthorized());
    }

    // Handle method execution.
    return super.invoke.apply(this, args);
  }

  /**
   * Get the method's authenticator.
   *
   * @return {Function} The method's authenticator.
   */
  get authenticator() {
    return this._options.authenticator;
  }

  /**
   * Set the method's authenticator.
   *
   * @param {Function} authenticator The new authenticator.
   *
   * @return {undefined}
   */
  set authenticator(authenticator) {
    assert(lodash.isFunction(authenticator), 'authenticator must be a function');
    this._options.authenticator = authenticator;
  }
}

module.exports = exports = AuthenticatedMethod;
