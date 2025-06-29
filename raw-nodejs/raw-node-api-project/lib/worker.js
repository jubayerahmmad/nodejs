/**
 * Title: Workers library
 * Description: Worker related files
 */

// Dependencies
const { sendTwilioSms } = require("../helpers/notifications");
const { parseJSON } = require("../helpers/utilities");
const data = require("./data");
const http = require("http");
const https = require("https");
const url = require("url");

// worker object - Scaffolding
const worker = {};

// lookup all checks
worker.gatherAllChecks = () => {
  // get all the checks from data
  data.list("checks", (err1, checks) => {
    if (!err1 && checks && checks.length > 0) {
      checks.forEach((check) => {
        // read the check data
        data.read("checks", check, (err2, originalCheckData) => {
          if (!err2 && originalCheckData) {
            // pass the data to check validator
            worker.validateCheckData(parseJSON(originalCheckData));
          } else {
            console.log("Error: Reading one of the check data");
          }
        });
      });
    } else {
      console.log("Error: Could not find any checks to process");
    }
  });
};

// validate individual check data
worker.validateCheckData = (originalCheckData) => {
  if (originalCheckData && originalCheckData.id) {
    originalCheckData.state =
      typeof originalCheckData.state === "string" &&
      ["up", "down"].indexOf(originalCheckData.state) > -1
        ? originalCheckData.state
        : "down";
    originalCheckData.lastChecked =
      typeof originalCheckData.lastChecked === "number" &&
      originalCheckData.lastChecked > 0
        ? originalCheckData.lastChecked
        : false;

    // pass to next processs
    worker.performCheck(originalCheckData);
  } else {
    console.log("Error: Check was invalid or not properly formatted");
  }
};

// perform check
worker.performCheck = (originalCheckData) => {
  // prepare the initial check outcome
  let checkOutCome = {
    error: false,
    responseCode: false,
  };

  // mark the outcome has not been send yet
  let outcomeSent = false;

  // parse the hostname & full url from original data
  const parsedUrl = url.parse(
    `${originalCheckData.protocol}://${originalCheckData.url}`,
    true
  );
  const hostName = parsedUrl.hostname;
  const { path } = parsedUrl;

  // construct the request
  const requestDetails = {
    protocol: `${originalCheckData.protocol}:`,
    hostname: hostName,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeoutSeconds * 1000,
  };

  const protocolToUse = originalCheckData.protocol === "http" ? http : https;

  const req = protocolToUse.request(requestDetails, (res) => {
    // grab the status of the response
    const status = res.statusCode;

    // update the check outcome
    checkOutCome.responseCode = status;
    if (!outcomeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutCome);
      outcomeSent = true;
    }
  });

  req.on("error", (e) => {
    checkOutCome = {
      error: true,
      value: e,
    };
    // update the check outcome
    if (!outcomeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutCome);
      outcomeSent = true;
    }
  });

  req.on("timeout", () => {
    checkOutCome = {
      error: true,
      responseCode: "timeout",
    };
    // update the check outcome
    if (!outcomeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutCome);
      outcomeSent = true;
    }
  });

  req.end();
};

// process check outcome
worker.processCheckOutcome = (originalCheckData, checkOutCome) => {
  // check if checkOutcome is up/down
  let state =
    !checkOutCome.error &&
    checkOutCome.responseCode &&
    originalCheckData?.successCodes?.indexOf(checkOutCome.responseCode) > -1
      ? "up"
      : "down";

  // decide whether we should alert the user or not
  // const alerWanted =
  //   originalCheckData.lastChecked && originalCheckData.state !== state
  //     ? true
  //     : false;

  const alerWanted = !!(
    originalCheckData.lastChecked && originalCheckData.state !== state
  );

  // update the check data
  const newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  // update to database(folder)
  data.update("checks", newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (alerWanted) {
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log("Alert Is not needeed as there is no change");
      }
    } else {
      console.log("Error Updating Check Data");
    }
  });
};

// alert  (sms twilio)
worker.alertUserToStatusChange = (newCheckData) => {
  const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

  sendTwilioSms(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`User was alerted to a status change via SMS: ${msg}`);
    } else {
      console.log("There was a problem sending sms to one of the user!", err);
    }
  });
};

// timer to execute worker process once per min
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 10000);
};

//  start worker
worker.init = () => {
  // execute all the checks
  worker.gatherAllChecks();

  // call the loop so checks continue
  worker.loop();
};

// export
module.exports = worker;
