/**
 * Title: Uptime Monitoring App
 * Description: A RESTful api to monitor up or downtime of user defined links.
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const data = require("./lib/data");

// App object - Scaffolding
const app = {};

// testing
data.delete("test", "newFile", (err) => {
  console.log(err);
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
