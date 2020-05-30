const commonjs = require('rollup-plugin-commonjs');
const babel = require('@rollup/plugin-babel').default;

module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    config.plugins.unshift(babel());
    config.plugins.push(
      commonjs({
        include: "**",
        namedExports: {
          "./endpoints_pb.js": Object.keys(require("./src/model/generated/endpoints_pb.js")),
          "./src/model/generated/beam_runner_api_pb.js": Object.keys(require("./src/model/generated/beam_runner_api_pb.js")),
        }
      })
    )
    return config; // always return a config.
  },
};