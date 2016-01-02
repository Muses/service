var service = require('../lib');
var Users = require('./Users');

var UserService = new service.Service(
  'UserService',
  {
    createUser: service.authenticated(
      function(props) {
        return Users.create(props);
      }
    ),

    getUser: service.authenticated(
      function(id) {
        return Users.get(id);
      }
    ),

    getUsers: service.authenticated(
      function(params) {
        return Users.query(params);
      }
    ),

    removeUser: service.authenticated(
      function(id) {
        return Users.remove(id);
      }
    ),

    updateUser: service.authenticated(
      function(id, props) {
        return Users.update(id, props);
      }
    )
  }
);

module.exports = exports = UserService;
