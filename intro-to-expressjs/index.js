/**
 * EXPRESS.JS LEARNING PROJECT - DOCUMENTED VERSION
 *
 * This file demonstrates key Express.js concepts including:
 * - Basic Express app setup
 * - Sub-applications (mounting apps)
 * - Route parameters and param middleware
 * - Route chaining with multiple HTTP methods
 * - Custom middleware creation
 * - JSON parsing middleware
 */

const express = require("express");

// Create the main Express application instance
// This is your primary server application
const app = express();

// Create a sub-application for admin routes
// Sub-applications are useful for organizing related routes
// and applying specific middleware to a group of routes
const admin = express();

/**
 * MIDDLEWARE SETUP
 *
 * express.json() is built-in middleware that parses incoming JSON payloads
 * It makes req.body available for POST/PUT requests with JSON data
 *
 * Example: If client sends {"name": "John"}, you can access it via req.body.name
 */
app.use(express.json());

/**
 * PARAM MIDDLEWARE
 *
 * app.param() runs whenever a specific parameter is found in the route
 * This is called "parameter middleware" and runs BEFORE the route handler
 *
 * @param {string} "id" - The parameter name to watch for
 * @param {Function} callback - Function that runs when :id is found in any route
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Function to call the next middleware
 * @param {string} id - The actual value of the :id parameter from the URL
 */
app.param("id", (req, res, next, id) => {
  /**
   * @typedef {Object} userDetails
   * @property {string|number} id - Unique identifier for the user.
   * @property {string} name - Name of the user.
   *
   * @description
   * This object holds the details of a user.
   * Typically used in Express.js route handlers to send or receive user data.
   *
   * @example
   * Sending userDetails as a response in an Express.js route
   * app.get('/user/:id', (req, res) => {
   *   const userDetails = {
   *     id: req.params.id,
   *     name: "John",
   *   };
   *   res.json(userDetails);
   * });
   */

  // Create a user object with the ID from the URL
  // In a real app, you'd probably fetch this from a database
  const userDetails = {
    id,
    name: "John",
  };

  // Attach the user details to the request object
  // This makes it available in all route handlers that use :id
  req.userDetails = userDetails;

  // Call next() to proceed to the next middleware or route handler
  // Without this, the request will hang!
  next();
});

/**
 * ROUTE CHAINING
 *
 * app.route() allows you to chain multiple HTTP methods for the same path
 * This is cleaner than writing separate app.get(), app.post(), etc.
 *
 * Benefits:
 * - Reduces repetition
 * - Groups related functionality
 * - Easier to maintain
 */
app
  .route("/about/mission")
  .get((req, res) => {
    // Handle GET requests to /about/mission
    res.send("HELLO FROM get");
  })
  .put((req, res) => {
    // Handle PUT requests to /about/mission
    res.send("HELLO FROM put");
  })
  .post((req, res) => {
    // Handle POST requests to /about/mission
    res.send("HELLO FROM post");
  });

/**
 * MOUNTING SUB-APPLICATIONS
 *
 * app.use() can mount sub-applications on specific paths
 * All routes in the 'admin' app will be prefixed with '/admin'
 *
 * Example: admin.get('/dashboard') becomes accessible at '/admin/dashboard'
 */
app.use("/admin", admin);

/**
 * ADMIN SUB-APPLICATION ROUTES
 *
 * This route is defined on the admin sub-app
 * Since admin is mounted at '/admin', this route is accessible at '/admin/dashboard'
 */
admin.get("/dashboard", (req, res) => {
  res.send("HELLO FROM ADMIN DASHBOARD");
});

/**
 * PARAMETERIZED ROUTES
 *
 * Routes with parameters use the colon syntax (:paramName)
 * The parameter value is available in req.params.paramName
 *
 * Since we defined param middleware for 'id', that runs first
 * Then this route handler runs with req.userDetails already populated
 */
app.get("/user/:id", (req, res) => {
  // Log the user details that were added by the param middleware
  console.log(req.userDetails);

  // Send a response back to the client
  res.send("HELLO FROM HOME ROUTE");
});

/**
 * START THE SERVER
 *
 * app.listen() starts the HTTP server on the specified port
 * The callback function runs once the server is successfully started
 *
 * @param {number} 3000 - Port number to listen on
 * @param {Function} callback - Function to run when server starts
 */
app.listen(3000, () => {
  console.log("Server is Running on Port 3000");
});

/**
 * TESTING YOUR SERVER
 *
 * Once running, you can test these endpoints:
 *
 * GET  http://localhost:3000/about/mission
 * POST http://localhost:3000/about/mission
 * PUT  http://localhost:3000/about/mission
 * GET  http://localhost:3000/user/123        (triggers param middleware)
 * GET  http://localhost:3000/admin/dashboard
 *
 * Use tools like:
 * - Browser (for GET requests)
 * - Postman
 * - curl commands
 * - VS Code REST Client extension
 */

/**
 * KEY CONCEPTS DEMONSTRATED:
 *
 * 1. Express Application: Main server instance
 * 2. Sub-applications: Organizing routes into logical groups
 * 3. Middleware: Functions that run before route handlers
 * 4. Built-in Middleware: express.json() for parsing JSON
 * 5. Custom Middleware: app.param() for parameter processing
 * 6. Route Chaining: Multiple HTTP methods on same path
 * 7. Route Parameters: Dynamic segments in URLs (:id)
 * 8. Mounting: Attaching sub-apps to main app
 * 9. Request/Response Objects: req and res in handlers
 * 10. Server Startup: app.listen() to start HTTP server
 */
