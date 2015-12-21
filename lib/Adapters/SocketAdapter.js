'use strict';

var assert = require('assert');
var Adapter = require('./Adapter');
var Method = require('../Methods/Method');
var Service = require('../Service');

/**
 * Muses Service Socket Adapter Class
 */
class SocketAdapter extends Adapter {

  /**
   * Instantiate a socket adapter.
   *
   * @param {Service} service The service to make available to the adapter.
   *
   * @return {SocketAdapter} The socket adapter instance.
   *
   * @throws {assert.AssertionError} If service is not an instance of Service.
   */
  constructor(service) {
    super(service);
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
    assert(method instanceof Method, 'method must be an instance of Method');
    return this.service.name + '.' + method.name;
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
