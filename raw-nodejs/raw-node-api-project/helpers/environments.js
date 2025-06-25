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
};
environments.production = {
  port: 4000,
  envName: "production",
  secretKey: "bijihiji",
  maxChecks: 5,
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
