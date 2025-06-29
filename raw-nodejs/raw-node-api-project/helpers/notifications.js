/**
 * Title: Notifications Library
 * Description: Important functions to notify users
 * Date: 06/25/2025
 *
 */

// dependencies
const https = require("https");
const querystring = require("querystring");
const { twilio } = require("./environments");

// module scaffolding
const notifications = {};

// send SMS to user
notifications.sendTwilioSms = (phone, msg, callback) => {
  // input validation
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;

  const userMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (userMsg && userPhone) {
    // configure the request payload
    const payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };

    // stringify the payload
    const stringPayload = querystring.stringify(payload);

    // configure request detaisl
    const requestDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    // initiate the request object
    const req = https.request(requestDetails, (res) => {
      // check the status of the sent request
      const status = res.statusCode;

      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status Code returned was ${status}`);
      }
    });

    req.on("error", (e) => callback(e));
    req.write(stringPayload);
    req.end();
  } else {
    callback(400, {
      message: "Given parameters are missing or invalid",
    });
  }
};

module.exports = notifications;
