/**
 * Title : User handler
 */

// Scaffolding
const handlers = {};

handlers.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handlers._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handlers._users = {};

handlers._users.post = (requestProperties, callback) => {};
handlers._users.get = (requestProperties, callback) => {
  callback(200);
};
handlers._users.put = (requestProperties, callback) => {};
handlers._users.delete = (requestProperties, callback) => {};

module.exports = handlers;
