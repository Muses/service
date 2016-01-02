'use strict';

var Adapters = require('./Adapters');
var Methods = require('./Methods');
var Service = require('./Service');

/**
 * Shorthand method creation.
 *
 * @param {Function} implementation The method implementation.
 * @param {Object}   options        The method options.
 *
 * @return {Object} A method object.
 */
function method(implementation, options) {
  return {
    type: Methods.Method,
    impl: implementation
  };
}

/**
 * Shorthand authenticated method creation.
 *
 * @param {Function} implementation The method implementation.
 * @param {Object}   options        The method options.
 *
 * @return {Object} A method object.
 */
function authenticated(implementation, options) {
  return {
    type: Methods.AuthenticatedMethod,
    impl: implementation
  };
}

module.exports = exports = {
  Adapters,
  Methods,
  Service,

  // Convenience utilities.
  method,
  authenticated
};
