/**
 * Title: Environments
 */

// scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "hijibiji",
  maxChecks: 5,
  twilio: {
    fromPhone: "+12695202065",
    accountSid: "AC2353bd2ac30d77f5fcb5d74063d87839",
    authToken: "bd7a3cb13ee79746355b9a7572c8b4d9",
  },
};
environments.production = {
  port: 4000,
  envName: "production",
  secretKey: "bijihiji",
  maxChecks: 5,
  twilio: {
    fromPhone: "+12695202065",
    accountSid: "AC2353bd2ac30d77f5fcb5d74063d87839",
    authToken: "bd7a3cb13ee79746355b9a7572c8b4d9",
  },
};

// determine which env was passed

const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding env object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module

module.exports = environmentToExport;
