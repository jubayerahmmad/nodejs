/**
 * Title: Uptime Monitoring App
 * Description: A RESTful api to monitor up or downtime of user defined links.
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const data = require("./lib/data");
const { sendTwilioSms } = require("./helpers/notifications");

// App object - Scaffolding
const app = {};

// testing
sendTwilioSms("01949404401", "Hello World", (err) => {
  console.log("This is the error", err);
});

// Create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Server is running on port ${environment.port}`);
  });
};

// Handle request and response
app.handleReqRes = handleReqRes;

// Start server
app.createServer();
