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


// We need this because js protobuf does not give us a way to access beam_urn by default.

const urns = {
  StandardPTransforms: {
    Primitives: {
      PAR_DO: "beam:transform:pardo:v1",
      FLATTEN: "beam:transform:flatten:v1",
      GROUP_BY_KEY: "beam:transform:group_by_key:v1",
      IMPULSE: "beam:transform:impulse:v1"
      // RESHUFFLE: "beam:transform:reshuffle:v1"
    }
  },
  GlobalWindowsPayload: {
    Enum: {
      PROPERTIES: "beam:window_fn:global_windows:v1"
    }
  },
  StandardCoders: {
    Enum: {
      BYTES: "beam:coder:bytes:v1",
      STRING_UTF8: "beam:coder:string_utf8:v1",
      GLOBAL_WINDOW: "beam:coder:global_window:v1"
    }
  },
  StandardEnvironments: {
    DOCKER: "beam:env:docker:v1",
    PROCESS: "beam:env:process:v1",
    EXTERNAL: "beam:env:external:v1"
  }
  // [FixedWindowsPayload.Enum.PROPERTIES]: "beam:window_fn:fixed_windows:v1",
  // [SlidingWindowsPayload.Enum.PROPERTIES]: "beam:window_fn:sliding_windows:v1",
  // [SessionWindowsPayload.Enum.PROPERTIES]: "beam:window_fn:session_windows:v1"
};

export const CUSTOM_JS_DOFN_URN = "beam:dofn:javascript:v1";
export const CUSTOM_JS_TRANSFORM_URN = "beam:transform:javascript:v1";
export const GENERIC_COMPOSITE_TRANSFORM_URN = "beam:transform:generic_composite:v1";

// These transforms are required to be implemented by external runners.
// These transforms, when running on a portable runner, should not specify an environment.
export const RUNNER_IMPLEMENTED_TRANSFORMS = [
  urns.StandardPTransforms.Primitives.GROUP_BY_KEY,
  urns.StandardPTransforms.Primitives.IMPULSE
];

export default urns;