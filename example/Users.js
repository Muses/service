'use strict';

module.exports = exports = {
  create: function(props) {
    return Promise.resolve({});
  },
  get: function(id) {
    return Promise.resolve({});
  },
  query: function(params) {
    return Promise.resolve([{}]);
  },
  remove: function(id) {
    return Promise.resolve({});
  },
  update: function(id, props) {
    return Promise.resolve({});
  },
};
