/**
 * Title: Uptime Monitoring App
 * Description: A RESTful api to monitor up or downtime of user defined links.
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");

// App object - Scaffolding
const app = {};

// Configs
app.config = {
  port: 3000,
};

// Create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Server is running on port ${app.config.port}`);
  });
};

// Handle request and response
app.handleReqRes = handleReqRes;

// Start server

app.createServer();
