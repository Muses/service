'use strict';

var assert = require('assert');
var lodash = require('lodash');
var Service = require('../Service');
var ServiceObject = require('../ServiceObject');

/**
 * Muses Service Adapter Class
 */
class Adapter extends ServiceObject {

  /**
   * The default adapter options.
   *
   * @type {Object}
   */
  static defaultOptions() {
    return {};
  }

  /**
   * Instantiate an adapter.
   *
   * @param {Service} service The service to make available to the adapter.
   * @param {Object}  options The adapter options.
   *
   * @return {Adapter} The adapter instance.
   *
   * @throws {assert.AssertionError} If service is not an instance of Service.
   * @throws {assert.AssertionError} If options is not a plain object.
   */
  constructor(service, options) {
    super();
    this.service = service;
    this.options = lodash.defaultsDeep({}, options, Adapter.defaultOptions());
  }
}

module.exports = exports = Adapter;
