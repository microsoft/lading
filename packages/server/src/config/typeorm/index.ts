// @tsed/cli do not edit
import * as defaultConfig from "./default.config.json";

const config = {
  ...defaultConfig,
  host: process.env["LADING_HOST"] || defaultConfig.host,
  username: process.env["LADING_USERNAME"] || defaultConfig.username,
  password: process.env["LADING_PASSWORD"] || defaultConfig.password,
  database: process.env["LADING_DATABASE"] || defaultConfig.database,
};

export default [config as any];
