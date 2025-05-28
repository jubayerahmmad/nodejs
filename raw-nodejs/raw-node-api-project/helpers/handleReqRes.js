/**
 * Title: Handle Request Response
 * Description: Handle Request Response
 */

// dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");

// scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // Response handle
  // get the url and parse it
  const parsedUrl = url.parse(req.url);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStrObj = parsedUrl.query;
  const headersObj = req.headers;
  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const requestProperties = {
    parsedUrl,
    path,
    method,
    trimmedPath,
    queryStrObj,
    headersObj,
  };

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  chosenHandler(requestProperties, (statusCode, payload) => {
    statusCode = typeof statusCode === "number" ? statusCode : 500;
    payload = typeof payload === "object" ? payload : {};
    const payloadStr = JSON.stringify(payload);

    // return the final Response
    res.writeHead(statusCode);
    res.end(payloadStr);
  });

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    console.log(realData);

    res.end("Hello Programmmers");
  });
};

module.exports = handler;
