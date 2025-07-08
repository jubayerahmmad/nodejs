/**
 * EXPRESS.JS REQUEST OBJECT LEARNING GUIDE
 *
 * This file demonstrates the most important properties and methods of the Express.js Request object (req).
 * The Request object represents the HTTP request and contains properties for the request query string,
 * parameters, body, HTTP headers, and more.
 *
 * Key Topics Covered:
 * - req.params (Route parameters)
 * - req.query (Query string parameters)
 * - req.body (Request body data)
 * - req.headers (HTTP headers)
 * - req.method (HTTP method)
 * - req.url and req.path (URL information)
 * - req.cookies (Cookie data)
 * - req.ip (Client IP address)
 * - req.get() (Get specific headers)
 */

const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies (required for req.body)
app.use(express.json());

// Middleware to parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World! Visit other routes to learn about req object.");
});

/**
 * 1. REQ.PARAMS - Route Parameters
 *
 * Route parameters are named URL segments that capture values at their position in the URL.
 * They are defined using a colon (:) followed by the parameter name.
 *
 * Example URLs that match this route:
 * - /users/123
 * - /users/john
 * - /users/abc123
 */
app.get("/users/:id", (req, res) => {
  /**
   * req.params contains route parameters as key-value pairs
   * The key is the parameter name, value is what was in the URL
   */
  console.log("Route Parameters:", req.params);

  const userId = req.params.id;

  res.json({
    message: "User route accessed",
    userId: userId,
    allParams: req.params,
  });
});

/**
 * Multiple Route Parameters
 *
 * You can have multiple parameters in a single route
 *
 * Example URL: /users/123/posts/456
 */
app.get("/users/:userId/posts/:postId", (req, res) => {
  console.log("Multiple Parameters:", req.params);

  const { userId, postId } = req.params; // Destructuring

  res.json({
    message: "User post accessed",
    userId: userId,
    postId: postId,
    allParams: req.params,
  });
});

/**
 * 2. REQ.QUERY - Query String Parameters
 *
 * Query parameters come after the ? in the URL
 * They are used for filtering, sorting, pagination, etc.
 *
 * Example URLs:
 * - /search?q=javascript&category=programming
 * - /products?page=2&limit=10&sort=name
 * - /api/users?active=true&role=admin
 */
app.get("/search", (req, res) => {
  /**
   * req.query contains query string parameters as key-value pairs
   * All values are strings by default
   */
  console.log("Query Parameters:", req.query);

  const searchTerm = req.query.q;
  const category = req.query.category;
  const page = parseInt(req.query.page) || 1; // Convert to number with default
  const limit = parseInt(req.query.limit) || 10;

  res.json({
    message: "Search performed",
    searchTerm: searchTerm,
    category: category,
    pagination: {
      page: page,
      limit: limit,
    },
    allQueryParams: req.query,
  });
});

/**
 * 3. REQ.BODY - Request Body Data
 *
 * Contains data sent in the request body (POST, PUT, PATCH requests)
 * Requires middleware like express.json() to parse the body
 *
 * Test with POST request to /api/users with JSON body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "age": 30
 * }
 */
app.post("/api/users", (req, res) => {
  /**
   * req.body contains the parsed request body
   * The structure depends on what the client sent
   */
  console.log("Request Body:", req.body);
  console.log("Content-Type:", req.get("Content-Type"));

  // Extract data from request body
  const { name, email, age } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required",
    });
  }

  res.json({
    message: "User created successfully",
    userData: {
      name: name,
      email: email,
      age: age,
    },
    receivedBody: req.body,
  });
});

/**
 * 4. REQ.HEADERS - HTTP Headers
 *
 * Contains all HTTP headers sent by the client
 * Headers provide metadata about the request
 *
 * Common headers: Content-Type, Authorization, User-Agent, Accept
 */
app.get("/headers", (req, res) => {
  /**
   * req.headers contains all request headers as key-value pairs
   * Header names are converted to lowercase
   */
  console.log("All Headers:", req.headers);

  // Get specific headers
  const userAgent = req.get("User-Agent"); // req.get() is cleaner than req.headers['user-agent']
  const contentType = req.get("Content-Type");
  const authorization = req.get("Authorization");

  res.json({
    message: "Headers information",
    specificHeaders: {
      userAgent: userAgent,
      contentType: contentType,
      authorization: authorization,
    },
    allHeaders: req.headers,
  });
});

/**
 * 5. REQ.METHOD and REQ.URL - Request Information
 *
 * Basic information about the HTTP request
 */
app.all("/request-info", (req, res) => {
  /**
   * req.method: HTTP method (GET, POST, PUT, DELETE, etc.)
   * req.url: Full URL path including query string
   * req.path: Just the path part without query string
   * req.protocol: http or https
   * req.hostname: Domain name
   * req.originalUrl: Original URL (useful with middleware)
   */
  console.log("Request Information:", {
    method: req.method,
    url: req.url,
    path: req.path,
    protocol: req.protocol,
    hostname: req.hostname,
  });

  res.json({
    message: "Request information",
    method: req.method,
    url: req.url,
    path: req.path,
    protocol: req.protocol,
    hostname: req.hostname,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
  });
});

/**
 * 6. REQ.IP - Client IP Address
 *
 * Gets the IP address of the client making the request
 */
app.get("/client-info", (req, res) => {
  /**
   * req.ip: Client's IP address
   * req.ips: Array of IP addresses (useful with proxies)
   */
  console.log("Client IP:", req.ip);
  console.log("Client IPs:", req.ips);

  res.json({
    message: "Client information",
    ip: req.ip,
    ips: req.ips,
    userAgent: req.get("User-Agent"),
  });
});

/**
 * 7. Combining Multiple Request Properties
 *
 * A practical example showing how to use multiple req properties together
 *
 * Example URL: /api/products/123?include=reviews&format=json
 * With Authorization header and JSON body
 */
app.put("/api/products/:id", (req, res) => {
  // Extract data from different parts of the request
  const productId = req.params.id;
  const includeReviews = req.query.include === "reviews";
  const format = req.query.format || "json";
  const authHeader = req.get("Authorization");
  const updateData = req.body;

  console.log("Complete Request Analysis:", {
    params: req.params,
    query: req.query,
    body: req.body,
    method: req.method,
    path: req.path,
    headers: req.headers,
  });

  // Simulate authentication check
  if (!authHeader) {
    return res.status(401).json({
      error: "Authorization header required",
    });
  }

  // Simulate validation
  if (!updateData || Object.keys(updateData).length === 0) {
    return res.status(400).json({
      error: "Update data is required in request body",
    });
  }

  res.json({
    message: "Product updated successfully",
    productId: productId,
    includeReviews: includeReviews,
    format: format,
    updateData: updateData,
    timestamp: new Date().toISOString(),
  });
});

/**
 * 8. REQ.GET() Method - Getting Specific Headers
 *
 * Demonstrates the req.get() method for accessing headers
 */
app.get("/api/validate", (req, res) => {
  // Using req.get() is the recommended way to access headers
  const apiKey = req.get("X-API-Key");
  const acceptHeader = req.get("Accept");
  const contentType = req.get("Content-Type");

  console.log("Header validation:", {
    apiKey: apiKey,
    accept: acceptHeader,
    contentType: contentType,
  });

  if (!apiKey) {
    return res.status(401).json({
      error: "API Key required in X-API-Key header",
    });
  }

  res.json({
    message: "Request validated",
    apiKey: apiKey,
    acceptedFormats: acceptHeader,
    contentType: contentType,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("\n=== TEST THESE ENDPOINTS ===");
  console.log("Basic route: GET http://localhost:3000/");
  console.log("Route params: GET http://localhost:3000/users/123");
  console.log("Multiple params: GET http://localhost:3000/users/123/posts/456");
  console.log(
    "Query params: GET http://localhost:3000/search?q=javascript&category=programming&page=2"
  );
  console.log("Headers: GET http://localhost:3000/headers");
  console.log("Request info: GET http://localhost:3000/request-info");
  console.log("Client info: GET http://localhost:3000/client-info");
  console.log(
    "POST body: POST http://localhost:3000/api/users (with JSON body)"
  );
  console.log(
    "PUT combined: PUT http://localhost:3000/api/products/123?include=reviews (with Auth header and JSON body)"
  );
  console.log(
    "Header validation: GET http://localhost:3000/api/validate (with X-API-Key header)"
  );
});

/**
 * KEY TAKEAWAYS:
 *
 * 1. req.params - Route parameters from URL path (/users/:id)
 * 2. req.query - Query string parameters (?key=value&key2=value2)
 * 3. req.body - Data sent in request body (POST/PUT requests)
 * 4. req.headers - All HTTP headers (use req.get() for specific headers)
 * 5. req.method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * 6. req.url/req.path - URL information
 * 7. req.ip - Client IP address
 * 8. req.get() - Clean way to access specific headers
 *
 * Remember: Always validate and sanitize data from req object before using it!
 */
