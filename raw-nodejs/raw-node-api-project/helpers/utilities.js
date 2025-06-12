/**
 * Title: Utilities
 * Description: Important utility functions
 */

// dependencies

const crypto = require("crypto");
const env = require("../helpers/environments");
// Scaffolding
const utilities = {};
// parse JSON string to object
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

// hash string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", env.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

module.exports = utilities;
