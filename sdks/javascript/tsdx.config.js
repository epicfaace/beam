/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const commonjs = require('rollup-plugin-commonjs');
const babel = require('@rollup/plugin-babel').default;

module.exports = {
  rollup(config) {
    // TODO: fix infinite loop here.
    config.plugins.unshift(babel());
    config.plugins.push(
      commonjs({
        include: "**",
        namedExports: {
          // This is required in order to import protobufs properly when building with commonjs
          "./endpoints_pb.js": Object.keys(require("./src/model/generated/endpoints_pb.js")),
          "./src/model/generated/beam_runner_api_pb.js": Object.keys(require("./src/model/generated/beam_runner_api_pb.js")),
          "./src/model/generated/beam_fn_api_grpc_pb": Object.keys(require("./src/model/generated/beam_fn_api_grpc_pb"))
        }
      })
    )
    return config;
  },
};