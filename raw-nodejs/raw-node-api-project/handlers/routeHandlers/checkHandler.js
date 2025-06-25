/**
 * Title : Check handler
 * Description: Handler to handle user defined checks
 */

// dependencies
const data = require("../../lib/data");
const { hash, createRandomString } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const { _token } = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environments");

// Scaffolding
const handlers = {};

handlers.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handlers._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handlers._check = {};

handlers._check.post = (requestProperties, callback) => {
  // Validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    const token =
      typeof requestProperties.headersObj.token === "string"
        ? requestProperties.headersObj.token
        : false;

    // lookup the user phone by reading the token
    data.read("tokens", token, (err1, tokenData) => {
      if (!err1 && tokenData) {
        const userPhone = parseJSON(tokenData).phone;
        // lookup the user data
        data.read("users", userPhone, (err2, userData) => {
          if (!err2 && userData) {
            _token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                const userObject = parseJSON(userData);
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxChecks) {
                  const checkId = createRandomString(20);
                  const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };
                  // save the object
                  data.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      // add check id to the user's object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      // save the new user data
                      data.update("users", userPhone, userObject, (err4) => {
                        if (!err4) {
                          // return the data about the new check
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: "There was a problem in the server side!",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "There was a problem in the server side!",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "Userhas already reached max check limit!",
                  });
                }
              } else {
                callback(403, {
                  error: "Authentication problem!",
                });
              }
            });
          } else {
            callback(403, {
              error: "User not found!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication problem!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handlers._check.get = (requestProperties, callback) => {
  // check the tokenId  if valid
  const tokenId =
    typeof requestProperties?.queryStr?.tokenId === "string" &&
    requestProperties.queryStr.tokenId.trim().length === 20
      ? requestProperties.queryStr.tokenId.trim()
      : false;

  if (tokenId) {
    // lookup the check
    data.read("checks", tokenId, (err1, checkData) => {
      if (!err1 && checkData) {
        const token =
          typeof requestProperties.headersObj.token === "string"
            ? requestProperties.headersObj.token
            : false;
        _token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
          if (tokenIsValid) {
            callback(200, parseJSON(checkData));
          } else {
            callback(403, {
              error: "Authentication Failure",
            });
          }
        });
      } else {
        callback(400, {
          error: "You have a problem in your request",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handlers._check.put = (requestProperties, callback) => {
  // check the tokenId  if valid
  const tokenId =
    typeof requestProperties?.body?.tokenId === "string" &&
    requestProperties.body.tokenId.trim().length === 20
      ? requestProperties.body.tokenId.trim()
      : false;
  // Validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (tokenId) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // lookup the checks
      data.read("checks", tokenId, (err1, checkData) => {
        if (!err1 && checkData) {
          const checkObject = parseJSON(checkData);
          const token =
            typeof requestProperties.headersObj.token === "string"
              ? requestProperties.headersObj.token
              : false;

          _token.verify(token, checkObject.userPhone, (tokenIsValid) => {
            if (tokenIsValid) {
              if (protocol) {
                checkObject.protocol = protocol;
              }
              if (url) {
                checkObject.url = url;
              }
              if (method) {
                checkObject.method = method;
              }
              if (successCodes) {
                checkObject.successCodes = successCodes;
              }
              if (timeoutSeconds) {
                checkObject.timeoutSeconds = timeoutSeconds;
              }
              // store the checkObject
              data.update("checks", tokenId, checkObject, (err2) => {
                if (!err2) {
                  callback(200);
                } else {
                  callback(500, {
                    error: "There was a server side error!",
                  });
                }
              });
            } else {
              callback(403, {
                error: "Authentication Failure",
              });
            }
          });
        } else {
          callback(500, {
            error: "There was a problem in server side",
          });
        }
      });
    } else {
      callback(400, {
        error: "You have to provide atleast one field to update!",
      });
    }
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handlers._check.delete = (requestProperties, callback) => {
  // check the tokenId  if valid
  const tokenId =
    typeof requestProperties?.queryStr?.tokenId === "string" &&
    requestProperties.queryStr.tokenId.trim().length === 20
      ? requestProperties.queryStr.tokenId.trim()
      : false;

  if (tokenId) {
    // lookup the check
    data.read("checks", tokenId, (err1, checkData) => {
      if (!err1 && checkData) {
        const token =
          typeof requestProperties.headersObj.token === "string"
            ? requestProperties.headersObj.token
            : false;
        _token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
          if (tokenIsValid) {
            // delete the check
            data.delete("checks", tokenId, (err2, checkData) => {
              if (!err2) {
                // lookup the user to delete check id too
                data.read(
                  "users",
                  parseJSON(checkData).userPhone,
                  (err3, userData) => {
                    const userObject = parseJSON(userData);
                    if (!err3 && userObject) {
                      const userChecks =
                        typeof userObject.checks === "object" &&
                        userObject.checks instanceof Array
                          ? userObject.checks
                          : [];
                      // remove the deleted check's id from user data
                      const checkPosition = userChecks.indexOf(tokenId);
                      if (checkPosition > -1) {
                        userChecks.splice(checkPosition, 1);
                        // save the user data
                        userObject.checks = userChecks;
                        data.update(
                          "users",
                          userObject.phone,
                          userObject,
                          (err4) => {
                            if (!err4) {
                              callback(200);
                            } else {
                              callback(400, {
                                error: "Error updating user",
                              });
                            }
                          }
                        );
                      } else {
                        callback(404, {
                          error: "Check ID Not found",
                        });
                      }
                    } else {
                      callback(404, {
                        error: "User not found",
                      });
                    }
                  }
                );
              } else {
                callback(500, {
                  error: "Error Deleting the check",
                });
              }
            });
          } else {
            callback(403, {
              error: "Authentication Failure",
            });
          }
        });
      } else {
        callback(400, {
          error: "You have a problem in your request",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

module.exports = handlers;
