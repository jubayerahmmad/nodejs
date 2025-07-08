/**
 * EXPRESS.JS RESPONSE OBJECT LEARNING GUIDE
 *
 * This file demonstrates the most important properties and methods of the Express.js Response object (res).
 * The Response object represents the HTTP response that Express sends when it gets an HTTP request.
 *
 * Key Topics Covered:
 * - res.send() (Send response)
 * - res.json() (Send JSON response)
 * - res.status() (Set status code)
 * - res.redirect() (Redirect requests)
 * - res.cookie() and res.clearCookie() (Cookie management)
 * - res.set() and res.get() (Header management)
 * - res.render() (Template rendering)
 * - res.download() and res.sendFile() (File handling)
 * - Method chaining and status codes
 * - Error responses and best practices
 */

const express = require("express");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.send(`
    <h1>Express Response Object Learning Guide</h1>
    <p>Visit different routes to learn about res object methods:</p>
    <ul>
      <li><a href="/basic-send">/basic-send</a> - res.send() examples</li>
      <li><a href="/json-response">/json-response</a> - res.json() examples</li>
      <li><a href="/status-codes">/status-codes</a> - res.status() examples</li>
      <li><a href="/headers">/headers</a> - Header management</li>
      <li><a href="/cookies">/cookies</a> - Cookie management</li>
      <li><a href="/redirect-me">/redirect-me</a> - Redirect examples</li>
      <li><a href="/download">/download</a> - File downloads</li>
      <li><a href="/method-chaining">/method-chaining</a> - Method chaining</li>
    </ul>
  `);
});

/**
 * 1. RES.SEND() - Basic Response Sending
 *
 * res.send() is the most basic method to send a response.
 * It can send strings, objects, arrays, or buffers.
 * Express automatically sets the Content-Type header based on the data type.
 */
app.get("/basic-send", (req, res) => {
  /**
   * res.send() automatically:
   * - Sets Content-Type header based on data type
   * - Ends the response (you can't send more data after this)
   * - Converts objects to JSON
   */

  console.log("Sending basic response");

  // You can send different types of data
  const dataType = req.query.type || "string";

  switch (dataType) {
    case "string":
      res.send("Hello World! This is a string response.");
      break;
    case "html":
      res.send("<h1>HTML Response</h1><p>This is HTML content</p>");
      break;
    case "object":
      res.send({
        message: "This object is automatically converted to JSON",
        timestamp: new Date(),
      });
      break;
    case "array":
      res.send([1, 2, 3, "array", "response"]);
      break;
    case "number":
      res.send(42); // Numbers are converted to strings
      break;
    default:
      res.send(
        "Unknown type. Try: ?type=string, ?type=html, ?type=object, ?type=array, ?type=number"
      );
  }
});

/**
 * 2. RES.JSON() - JSON Response
 *
 * res.json() explicitly sends JSON responses.
 * It's more semantic than res.send() when you know you're sending JSON.
 * It also handles JSON.stringify() automatically and sets proper Content-Type.
 */
app.get("/json-response", (req, res) => {
  /**
   * res.json() is specifically for JSON responses
   * - Always sets Content-Type to application/json
   * - Handles JSON.stringify() automatically
   * - More semantic than res.send() for API responses
   */

  console.log("Sending JSON response");

  const responseData = {
    success: true,
    message: "This is a JSON response",
    data: {
      user: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      },
      preferences: {
        theme: "dark",
        notifications: true,
      },
    },
    timestamp: new Date().toISOString(),
    requestInfo: {
      method: req.method,
      path: req.path,
      query: req.query,
    },
  };

  res.json(responseData);
});

/**
 * 3. RES.STATUS() - HTTP Status Codes
 *
 * res.status() sets the HTTP status code for the response.
 * Common status codes: 200 (OK), 201 (Created), 400 (Bad Request),
 * 401 (Unauthorized), 404 (Not Found), 500 (Internal Server Error)
 */
app.get("/status-codes", (req, res) => {
  /**
   * res.status() sets the HTTP status code
   * Common patterns:
   * - 200: Success
   * - 201: Created
   * - 400: Bad Request
   * - 401: Unauthorized
   * - 404: Not Found
   * - 500: Internal Server Error
   */

  const statusType = req.query.status || "200";

  console.log(`Sending response with status: ${statusType}`);

  switch (statusType) {
    case "200":
      res.status(200).json({ message: "Success! Everything is OK", code: 200 });
      break;
    case "201":
      res.status(201).json({
        message: "Created! New resource created successfully",
        code: 201,
      });
      break;
    case "400":
      res
        .status(400)
        .json({ error: "Bad Request! Invalid data provided", code: 400 });
      break;
    case "401":
      res
        .status(401)
        .json({ error: "Unauthorized! Authentication required", code: 401 });
      break;
    case "404":
      res
        .status(404)
        .json({ error: "Not Found! Resource doesn't exist", code: 404 });
      break;
    case "500":
      res.status(500).json({
        error: "Internal Server Error! Something went wrong",
        code: 500,
      });
      break;
    default:
      res.status(200).json({
        message:
          "Try: ?status=200, ?status=201, ?status=400, ?status=401, ?status=404, ?status=500",
        availableStatuses: [200, 201, 400, 401, 404, 500],
      });
  }
});

/**
 * 4. RES.SET() and RES.GET() - Header Management
 *
 * res.set() sets response headers
 * res.get() gets response headers (less commonly used)
 */
app.get("/headers", (req, res) => {
  /**
   * res.set() sets response headers
   * You can set individual headers or multiple headers at once
   */

  console.log("Setting custom headers");

  // Set individual headers
  res.set("X-Custom-Header", "Learning Express.js");
  res.set("X-Response-Time", Date.now().toString());

  // Set multiple headers at once
  res.set({
    "X-API-Version": "1.0",
    "X-Developer": "Your Name",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  });

  // You can also use res.header() which is an alias for res.set()
  res.header("X-Powered-By", "Express.js Learning");

  // Get a previously set header (rarely used)
  const customHeader = res.get("X-Custom-Header");

  res.json({
    message: "Headers have been set!",
    customHeaderValue: customHeader,
    tip: "Check the Network tab in browser DevTools to see the headers",
    setHeaders: {
      "X-Custom-Header": "Learning Express.js",
      "X-Response-Time": "Current timestamp",
      "X-API-Version": "1.0",
      "X-Developer": "Your Name",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
      "X-Powered-By": "Express.js Learning",
    },
  });
});

/**
 * 5. RES.COOKIE() and RES.CLEARCOOKIE() - Cookie Management
 *
 * res.cookie() sets cookies in the response
 * res.clearCookie() removes cookies
 */
app.get("/cookies", (req, res) => {
  /**
   * res.cookie() sets cookies in the client's browser
   * res.clearCookie() removes cookies
   */

  const action = req.query.action || "set";

  console.log(`Cookie action: ${action}`);

  if (action === "set") {
    // Set simple cookie
    res.cookie("username", "john_doe");

    // Set cookie with options
    res.cookie("sessionId", "abc123xyz", {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      httpOnly: true, // Cookie only accessible by server
      secure: false, // Set to true in production with HTTPS
      sameSite: "strict", // CSRF protection
    });

    // Set signed cookie (requires cookie-parser middleware in production)
    res.cookie(
      "preferences",
      JSON.stringify({
        theme: "dark",
        language: "en",
      }),
      {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
      }
    );

    res.json({
      message: "Cookies have been set!",
      cookiesSet: {
        username: "john_doe",
        sessionId: "abc123xyz (with options)",
        preferences: "JSON object with theme and language",
      },
      tip: "Check Application tab in browser DevTools to see cookies",
    });
  } else if (action === "clear") {
    // Clear specific cookies
    res.clearCookie("username");
    res.clearCookie("sessionId");
    res.clearCookie("preferences");

    res.json({
      message: "Cookies have been cleared!",
      clearedCookies: ["username", "sessionId", "preferences"],
    });
  } else {
    res.json({
      message: "Cookie management demo",
      usage: {
        setCookies: "/cookies?action=set",
        clearCookies: "/cookies?action=clear",
      },
    });
  }
});

/**
 * 6. RES.REDIRECT() - Redirecting Requests
 *
 * res.redirect() redirects the client to a different URL
 * Default status code is 302 (temporary redirect)
 */
app.get("/redirect-me", (req, res) => {
  /**
   * res.redirect() sends a redirect response
   * - Default status code: 302 (temporary redirect)
   * - You can specify different status codes
   * - Can redirect to relative or absolute URLs
   */

  const destination = req.query.to || "home";

  console.log(`Redirecting to: ${destination}`);

  switch (destination) {
    case "home":
      res.redirect("/"); // Redirect to home page
      break;
    case "json":
      res.redirect("/json-response"); // Redirect to JSON endpoint
      break;
    case "external":
      res.redirect("https://www.google.com"); // External redirect
      break;
    case "permanent":
      res.redirect(301, "/"); // Permanent redirect (301)
      break;
    case "temporary":
      res.redirect(302, "/"); // Temporary redirect (302) - default
      break;
    default:
      res.redirect(`/?message=Unknown destination: ${destination}`);
  }
});

/**
 * 7. RES.DOWNLOAD() and RES.SENDFILE() - File Handling
 *
 * res.download() prompts file download
 * res.sendFile() sends a file as response
 */
app.get("/download", (req, res) => {
  /**
   * res.download() prompts the client to download a file
   * res.sendFile() sends a file as the response content
   */

  const fileType = req.query.type || "text";

  console.log(`File download requested: ${fileType}`);

  // For demo purposes, we'll create a simple text response
  // In real apps, you'd have actual files to serve

  if (fileType === "text") {
    // Simulate text file download
    res.set({
      "Content-Type": "text/plain",
      "Content-Disposition": 'attachment; filename="sample.txt"',
    });
    res.send(
      "This is a sample text file content.\nDownloaded from Express.js server!"
    );
  } else if (fileType === "json") {
    // Simulate JSON file download
    const jsonData = {
      message: "Sample JSON file",
      timestamp: new Date().toISOString(),
      data: [1, 2, 3, 4, 5],
    };

    res.set({
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="data.json"',
    });
    res.json(jsonData);
  } else {
    res.json({
      message: "File download demo",
      availableTypes: {
        text: "/download?type=text",
        json: "/download?type=json",
      },
      note: "In production, you'd use res.download() with actual file paths",
    });
  }
});

/**
 * 8. METHOD CHAINING - Combining Response Methods
 *
 * Many response methods return the response object, allowing method chaining
 * This makes code more concise and readable
 */
app.get("/method-chaining", (req, res) => {
  /**
   * Method chaining allows combining multiple response methods
   * Most res methods return the response object for chaining
   */

  const scenario = req.query.scenario || "success";

  console.log(`Method chaining scenario: ${scenario}`);

  switch (scenario) {
    case "success":
      // Chain status, headers, and JSON response
      res.status(200).set("X-Response-Type", "Success").json({
        success: true,
        message: "Method chaining example",
        timestamp: new Date().toISOString(),
      });
      break;

    case "error":
      // Chain status and JSON for error response
      res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "This is an error response using method chaining",
      });
      break;

    case "cookie":
      // Chain cookie setting with response
      res.cookie("demo", "method-chaining").status(200).json({
        message: "Cookie set and response sent using method chaining",
        cookieSet: "demo=method-chaining",
      });
      break;

    case "headers":
      // Chain multiple header operations
      res
        .set("X-Custom-1", "Value1")
        .set("X-Custom-2", "Value2")
        .status(200)
        .json({
          message: "Multiple headers set using method chaining",
          headers: {
            "X-Custom-1": "Value1",
            "X-Custom-2": "Value2",
          },
        });
      break;

    default:
      res.status(200).json({
        message: "Method chaining examples",
        availableScenarios: {
          success: "/method-chaining?scenario=success",
          error: "/method-chaining?scenario=error",
          cookie: "/method-chaining?scenario=cookie",
          headers: "/method-chaining?scenario=headers",
        },
      });
  }
});

/**
 * 9. API ENDPOINTS - Practical Examples
 *
 * Real-world examples combining multiple response methods
 */

// POST endpoint demonstrating status codes and validation
app.post("/api/users", (req, res) => {
  const { name, email, age } = req.body;

  console.log("Creating user:", req.body);

  // Validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      message: "Name and email are required",
      receivedData: req.body,
    });
  }

  // Simulate successful creation
  const newUser = {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
    age: age || null,
    createdAt: new Date().toISOString(),
  };

  res.status(201).set("X-Resource-Created", "User").json({
    success: true,
    message: "User created successfully",
    user: newUser,
  });
});

// Error handling example
app.get("/api/error-demo", (req, res) => {
  const errorType = req.query.type || "generic";

  console.log(`Demonstrating error type: ${errorType}`);

  switch (errorType) {
    case "validation":
      res.status(400).json({
        success: false,
        error: "Validation Error",
        message: "Invalid input data",
        details: {
          field: "email",
          issue: "Invalid email format",
        },
      });
      break;

    case "auth":
      res.status(401).set("WWW-Authenticate", "Bearer").json({
        success: false,
        error: "Authentication Required",
        message: "Please provide valid authentication token",
      });
      break;

    case "forbidden":
      res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You don't have permission to access this resource",
      });
      break;

    case "notfound":
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "The requested resource was not found",
      });
      break;

    case "server":
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: "Something went wrong on the server",
      });
      break;

    default:
      res.status(200).json({
        message: "Error demonstration",
        availableTypes: {
          validation: "/api/error-demo?type=validation",
          auth: "/api/error-demo?type=auth",
          forbidden: "/api/error-demo?type=forbidden",
          notfound: "/api/error-demo?type=notfound",
          server: "/api/error-demo?type=server",
        },
      });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("\n=== TEST THESE ENDPOINTS ===");
  console.log("Home: GET http://localhost:3000/");
  console.log("Basic send: GET http://localhost:3000/basic-send?type=object");
  console.log("JSON response: GET http://localhost:3000/json-response");
  console.log(
    "Status codes: GET http://localhost:3000/status-codes?status=404"
  );
  console.log("Headers: GET http://localhost:3000/headers");
  console.log("Cookies: GET http://localhost:3000/cookies?action=set");
  console.log("Redirect: GET http://localhost:3000/redirect-me?to=json");
  console.log("Download: GET http://localhost:3000/download?type=text");
  console.log(
    "Method chaining: GET http://localhost:3000/method-chaining?scenario=success"
  );
  console.log(
    "Create user: POST http://localhost:3000/api/users (with JSON body)"
  );
  console.log(
    "Error demo: GET http://localhost:3000/api/error-demo?type=validation"
  );
});

/**
 * KEY TAKEAWAYS:
 *
 * 1. res.send() - Basic response sending (auto-detects content type)
 * 2. res.json() - Explicit JSON responses (better for APIs)
 * 3. res.status() - Set HTTP status codes (200, 404, 500, etc.)
 * 4. res.set() - Set response headers
 * 5. res.cookie() - Set cookies in client browser
 * 6. res.clearCookie() - Remove cookies
 * 7. res.redirect() - Redirect client to different URL
 * 8. res.download() - Prompt file download
 * 9. Method chaining - Combine multiple response methods
 * 10. Error handling - Proper status codes and error messages
 *
 * Best Practices:
 * - Always use appropriate status codes
 * - Use res.json() for API responses
 * - Set meaningful headers when needed
 * - Handle errors gracefully with proper error responses
 * - Use method chaining for cleaner code
 * - Validate input and provide clear error messages
 */
