
var assert = require('assert');
var errors = require('muses-errors');
var service = require('../../lib/');

describe('SocketAdapter', function() {

  var alice = {
    id: 1,
    name: 'Alice',
    email: 'alice@apple.com'
  };

  /**
   * Mock Socket
   */
  function SocketMock() {
    this.handlers = {};
  }

  SocketMock.prototype.on = function(name, handler) {
    this.handlers[name] = handler;
  };

  SocketMock.prototype.trigger = function(name) {
    var args = Array.prototype.slice.call(arguments, 1);
    return this.handlers[name].apply(this, args);
  };

  // Method to create a user.
  var createUserMethod = new service.Methods.Method(
    'createUser',
    function(props) {
      return alice;
    }
  );

  // Method to get a user.
  var getUserMethod = new service.Methods.Method(
    'getUser',
    function(id) {
      if (id === 1) {
        return alice;
      }
      return null;
    }
  );

  // Mock user service.
  var userService = new service.Service('Users', [ createUserMethod, getUserMethod ]);

  // User service adapter.
  var userAdapter = new service.Adapters.SocketAdapter(userService);

  it('should be an function', function() {
    expect(typeof service.Adapters.SocketAdapter).toEqual('function');
  });

  it('should should require a service', function() {

    var throwService = function() {
      return new service.Adapters.SocketAdapter();
    };

    var success = function() {
      return new service.Adapters.SocketAdapter(userService);
    };

    expect(throwService).toThrowError(assert.AssertionError, 'service must be an instance of Service');
    expect(success).not.toThrow();
  });

  it('should route methods with the service', function() {
    expect(userAdapter.route(getUserMethod)).toEqual('Users.getUser');
    expect(userAdapter.route(createUserMethod)).toEqual('Users.createUser');
  });

  describe('initialize', function() {

    var socket = new SocketMock();
    userAdapter.initialize(socket);
    var handlers = socket.handlers;

    it('should register all methods on the socket', function() {
      expect(typeof handlers).toEqual('object');
      expect(Object.keys(handlers)).toContain('Users.createUser');
      expect(Object.keys(handlers)).toContain('Users.getUser');
    });

    it('should trigger registered methods with parameters', function(done) {
      socket.trigger('Users.getUser', 1, function(err, user) {
        expect(err).toEqual(null);
        expect(user).toBe(alice);
        done();
      });
    });

    it('should pass errors as first parameter to ack callback', function(done) {
      socket.trigger('Users.getUser', 2 /* doesn't exist */, function(err, user) {
        expect(err).toEqual(new errors.NotFound());
        expect(user).toEqual(undefined);
        done();
      });
    });
  });
});
