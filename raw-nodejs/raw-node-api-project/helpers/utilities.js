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

// create random string
utilities.createRandomString = (strLength) => {
  let length = strLength;
  length = typeof strLength === "number" && strLength > 0 ? strLength : false;

  if (length) {
    const possibleCharacters = "abcdefghijklmnopqrstuvqxyz1234567890";
    let str = "";
    for (let i = 1; i <= length; i += 1) {
      const randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      str += randomCharacter;
    }
    return str;
  } else {
    return null;
  }
};

module.exports = utilities;
