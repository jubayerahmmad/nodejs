/**
 * Title: Project Initial file
 * Description: Initial file to start the node server and workers
 */

// Dependencies
const server = require("./lib/server");
const worker = require("./lib/worker");

// App object - Scaffolding
const app = {};

app.init = () => {
  // start server
  server.init();
  // start worker
  worker.init();
};

app.init();
