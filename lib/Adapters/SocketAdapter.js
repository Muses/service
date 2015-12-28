'use strict';

var assert = require('assert');
var Adapter = require('./Adapter');
var lodash = require('lodash');
var Method = require('../Methods/Method');
var Service = require('../Service');

/**
 * Muses Service Socket Adapter Class
 */
class SocketAdapter extends Adapter {

  /**
   * The default adapter options.
   *
   * @type {Object}
   */
  static defaultOptions() {
    return {
      router: SocketAdapter.defaultRouter()
    };
  }

  /**
   * The default socket router.
   *
   * @return {Function} The default route function.
   */
  static defaultRouter() {
    return function(method) {
      assert(method instanceof Method, 'method must be an instance of Method');
      return this.service.name + '.' + method.name;
    };
  }

  /**
   * Instantiate a socket adapter.
   *
   * @param {Service} service The service to make available to the adapter.
   * @param {Object}  options The adapter options.
   *
   * @return {SocketAdapter} The socket adapter instance.
   *
   * @throws {assert.AssertionError} If service is not an instance of Service.
   * @throws {assert.AssertionError} If options is not a plain object.
   */
  constructor(service, options) {
    super(
      service,
      lodash.defaultsDeep({}, options, SocketAdapter.defaultOptions())
    );
  }

  /**
   * Build a route for the adapter to the specified method.
   *
   * @param {Method} method The target method.
   *
   * @return {String} The route.
   *
   * @throws {assert.AssertionError} If method is not an instance of Method.
   */
  route(method) {
    return this._router(method);
  }

  /**
   * Initialize the adapter's behavior on the specified socket.
   *
   * @param {Socket} socket The socket.
   *
   * @return {self} The adapter.
   */
  initialize(socket) {
    this.service.methods.forEach(this._addHandler.bind(this, socket));
    return this;
  }

  /**
   * Get the adapter's router.
   *
   * @return {Function} The adapter's router.
   */
  get router() {
    return this._router;
  }

  /**
   * Set the adapter's router.
   *
   * @param {Function} router The router instance.
   *
   * @throws {assert.AssertionError} If router is not a function.
   */
  set router(router) {
    assert(lodash.isFunction(router), 'router must be a function');
    this._router = router.bind(this);
  }

  /**
   * Add a socket handler for the specified method.
   *
   * @param {Socket} socket The socket.
   * @param {Method} method The method to handle.
   */
  _addHandler(socket, method) {
    socket.on(this.route(method), this._buildHandler(socket, method));
  }

  /**
   * Build a socket handler for the specified method.
   *
   * @param {Socket} socket The socket.
   * @param {Method} method The method to handle.
   *
   * @return {Function} The socket handler for the method.
   */
  _buildHandler(socket, method) {

    var name = method.name;
    var service = this.service;

    // Return the handler.
    return function handleMethod() {

      var args = Array.prototype.slice.call(arguments);
      args.unshift(name);
      var ack = function() {};

      // If an acknowledge callback was supplied, extract it from the arguments.
      if (typeof (arguments[arguments.length - 1]) === 'function') {
        ack = args.pop();
      }

      // Invoke the service method.
      return service.invoke
        .apply(service, args)
        .then(function() {
          var args = Array.prototype.slice.call(arguments);
          args.unshift(null);
          return ack.apply(this, args);
        })
        .catch(function(err) {
          return ack(err);
        });
    };
  }

  /**
   * Get the adapter middleware.
   *
   * @return {Function} A middleware function that will register the adapter with the socket system.
   */
  get middleware() {
    return (socket, next) => {
      this.initialize(socket);
      return next();
    };
  }
}

module.exports = exports = SocketAdapter;
