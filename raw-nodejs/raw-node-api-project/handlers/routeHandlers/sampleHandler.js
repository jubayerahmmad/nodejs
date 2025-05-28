/**
 * Title : Sample handler
 */

// Scaffolding
const handlers = {};

handlers.sampleHandler = (requestProperties, callback) => {
  console.log("requestProperties from Sample url", requestProperties);

  callback(200, {
    message: "This is a sample url",
  });
};

module.exports = handlers;
