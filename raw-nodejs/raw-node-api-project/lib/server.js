/**
 * Title: Server library
 * Description: Server related files

 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
const environment = require("../helpers/environments");

// server object - Scaffolding
const server = {};

// testing
// sendTwilioSms("01949404401", "Hello World", (err) => {
//   console.log("This is the error", err);
// });

// Create Server
server.createServer = () => {
  const createServerVar = http.createServer(server.handleReqRes);
  createServerVar.listen(environment.port, () => {
    console.log(`Server is running on port ${environment.port}`);
  });
};

// Handle request and response
server.handleReqRes = handleReqRes;

// Start server
server.init = () => {
  server.createServer();
};

// export
module.exports = server;
