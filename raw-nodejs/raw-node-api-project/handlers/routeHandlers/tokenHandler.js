/**
 * Title : Token handler
 */

// dependencies
const {
  hash,
  createRandomString,
  parseJSON,
} = require("../../helpers/utilities");
const data = require("../../lib/data");

// Scaffolding
const handlers = {};

handlers.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handlers._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handlers._token = {};

handlers._token.post = (requestProperties, callback) => {
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

  if (phone && password) {
    data.read("users", phone, (err1, userData) => {
      const hashedPassword = hash(password);
      if (hashedPassword === parseJSON(userData).password) {
        const tokenId = createRandomString(20);
        const expires = Date.now() * 60 * 60 * 1000;
        const tokenObject = {
          phone,
          tokenId,
          expires,
        };

        // store the token
        data.create("tokens", tokenId, tokenObject, (createError) => {
          if (!createError) {
            callback(200, tokenObject);
          } else {
            callback(400, {
              error: "Error Creating Token",
            });
          }
        });
      } else {
        callback(400, {
          error: "Password is not Valid",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have problem in your request",
    });
  }
};

handlers._token.get = (requestProperties, callback) => {
  // check the tokenId  if valid
  const tokenId =
    typeof requestProperties?.queryStr?.tokenId === "string" &&
    requestProperties.queryStr.tokenId.trim().length === 20
      ? requestProperties.queryStr.tokenId.trim()
      : false;

  if (tokenId) {
    // lookup the token
    data.read("tokens", tokenId, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          error: "Requested token was not found!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested token was not found!",
    });
  }
};

handlers._token.put = (requestProperties, callback) => {
  const tokenId =
    typeof requestProperties.body.tokenId === "string" &&
    requestProperties.body.tokenId.trim().length === 20
      ? requestProperties.body.tokenId
      : false;
  const extend = !!(
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
  );

  if (tokenId && extend) {
    data.read("tokens", tokenId, (err1, tokenData) => {
      const tokenObject = parseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;
        // store the updated token
        data.update("tokens", tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200);
          } else {
            callback(500, {
              error: "There was a server side error!",
            });
          }
        });
      } else {
        callback(400, {
          error: "Token already expired!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request",
    });
  }
};

handlers._token.delete = (requestProperties, callback) => {
  // check the token if valid
  const tokenId =
    typeof requestProperties.queryStr.tokenId === "string" &&
    requestProperties.queryStr.tokenId.trim().length === 20
      ? requestProperties.queryStr.tokenId
      : false;

  if (tokenId) {
    // lookup the user
    data.read("tokens", tokenId, (err1, tokenData) => {
      if (!err1 && tokenData) {
        data.delete("tokens", tokenId, (err2) => {
          if (!err2) {
            callback(200, {
              message: "Token was successfully deleted!",
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
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

handlers._token.verify = (tokenId, phone, callback) => {
  data.read("tokens", tokenId, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parseJSON(tokenData).phone === phone &&
        parseJSON(tokenData).expires > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handlers;
