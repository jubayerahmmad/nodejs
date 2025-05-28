/**
 * Title : Not Found handler
 */

// Scaffolding
const handlers = {};

handlers.notFoundHandler = (requestProperties, callback) => {
  console.log(requestProperties);

  callback(404, {
    message: "Your requested url is not found",
  });
};

module.exports = handlers;
