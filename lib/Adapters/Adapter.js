'use strict';

var assert = require('assert');
var Service = require('../Service');

/**
 * Muses Service Adapter Class
 */
class Adapter {

  /**
   * Instantiate an adapter.
   *
   * @param {Service} service The service to make available to the adapter.
   *
   * @return {Adapter} The adapter instance.
   *
   * @throws {assert.AssertionError} If service is not an instance of Service.
   */
  constructor(service) {
    this.service = service;
  }

  /**
   * Get the adapter's service.
   *
   * @return {Service} The adapter's attached service.
   */
  get service() {
    return this._service;
  }

  /**
   * Set the adapter's service.
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

module.exports = exports = Adapter;
