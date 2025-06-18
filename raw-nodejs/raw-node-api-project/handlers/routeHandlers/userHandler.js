/**
 * Title : User handler
 */

// dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const { _token } = require("./tokenHandler");

// Scaffolding
const handlers = {};

handlers.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handlers._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handlers._users = {};

handlers._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body?.firstName === "string" &&
    requestProperties.body?.firstName.trim().length > 0
      ? requestProperties.body?.firstName
      : false;

  const lastName =
    typeof requestProperties.body?.lastName === "string" &&
    requestProperties.body?.lastName.trim().length > 0
      ? requestProperties.body?.lastName
      : false;

  const phone =
    typeof requestProperties.body?.phone === "string" &&
    requestProperties.body?.phone.trim().length === 11
      ? requestProperties.body?.phone
      : false;

  const password =
    typeof requestProperties.body?.password === "string" &&
    requestProperties.body?.password.trim().length > 0
      ? requestProperties.body?.password
      : false;

  const tosAgreement =
    typeof requestProperties.body?.tosAgreement === "boolean" &&
    requestProperties.body?.tosAgreement
      ? requestProperties.body?.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that the user doesn't already exists
    data.read("users", phone, (readErr) => {
      if (readErr) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        // store the user to db
        data.create("users", phone, userObject, (createErr) => {
          if (!createErr) {
            callback(200, { message: "User created Successfully" });
          } else {
            callback(500, { error: "Error creating user" });
          }
        });
      } else {
        callback(500, { error: "There was an error in server side" });
      }
    });
  } else {
    callback(400, {
      error: "You have problem in your request",
    });
  }
};
handlers._users.get = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties?.queryStr?.phone === "string" &&
    requestProperties.queryStr.phone.trim().length === 11
      ? requestProperties.queryStr.phone.trim()
      : false;

  if (phone) {
    // verify token
    const token =
      typeof requestProperties.headersObj?.token === "string"
        ? requestProperties.headersObj?.token
        : false;

    _token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.read("users", phone, (err, userData) => {
          const user = { ...parseJSON(userData) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, {
              error: "Requested user was not found!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failure!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user was not found!",
    });
  }
};
handlers._users.put = (requestProperties, callback) => {
  const phone =
    typeof requestProperties?.queryStr?.phone === "string" &&
    requestProperties.queryStr.phone.trim().length === 11
      ? requestProperties.queryStr.phone.trim()
      : false;
  const firstName =
    typeof requestProperties.body?.firstName === "string" &&
    requestProperties.body?.firstName.trim().length > 0
      ? requestProperties.body?.firstName
      : false;

  const lastName =
    typeof requestProperties.body?.lastName === "string" &&
    requestProperties.body?.lastName.trim().length > 0
      ? requestProperties.body?.lastName
      : false;

  const password =
    typeof requestProperties.body?.password === "string" &&
    requestProperties.body?.password.trim().length > 0
      ? requestProperties.body?.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      // verify token
      const token =
        typeof requestProperties.headersObj?.token === "string"
          ? requestProperties.headersObj?.token
          : false;

      _token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          // loopkup the user
          data.read("users", phone, (err1, uData) => {
            const userData = { ...parseJSON(uData) };

            if (!err1 && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.firstName = firstName;
              }
              if (password) {
                userData.password = hash(password);
              }

              // store to database
              data.update("users", phone, userData, (err2) => {
                if (!err2) {
                  callback(200, {
                    message: "User was updated successfully!",
                  });
                } else {
                  callback(500, {
                    error: "There was a problem in the server side!",
                  });
                }
              });
            } else {
              callback(400, {
                error: "You have a problem in your request!",
              });
            }
          });
        } else {
          callback(403, {
            error: "Authentication failure!",
          });
        }
      });
    } else {
      callback(400, {
        error: "You have a problem in your request!",
      });
    }
  } else {
    callback(400, {
      error: "Invalid phone number. Please try again!",
    });
  }
};
handlers._users.delete = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties?.queryStr?.phone === "string" &&
    requestProperties.queryStr.phone.trim().length === 11
      ? requestProperties.queryStr.phone.trim()
      : false;

  if (phone) {
    // verify token
    const token =
      typeof requestProperties.headersObj?.token === "string"
        ? requestProperties.headersObj?.token
        : false;
    _token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.read("users", phone, (err1, userData) => {
          if (!err1 && userData) {
            data.delete("users", phone, (err2) => {
              if (!err2) {
                callback(200, {
                  message: "User was successfully deleted!",
                });
              } else {
                callback(500, {
                  error: "There was a server side error!",
                });
              }
            });
          } else {
            callback(500, {
              error: "There was a server side error!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failure!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

module.exports = handlers;
