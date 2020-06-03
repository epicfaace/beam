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

import beam_runner_api_pb from '../model/generated/beam_runner_api_pb';
import { FunctionSpec } from '../specs/function-spec';
import urns from '../model/urns';
import { ApiServiceDescriptor } from '../model/generated/endpoints_pb';
import { PipelineContext } from '../pipeline/pipeline-context';

export class Environment extends FunctionSpec {

  /**
   * Serialize this object to a protobuf.
   * @return {FunctionSpec_} The generated protobuf.
   */
  serialize(_context: PipelineContext) {
    const spec = new beam_runner_api_pb.Environment();
    spec.setUrn(this._urn());
    spec.setPayload(this._payload() as Uint8Array);
    spec.addCapabilities("beam:coder:bytes:v1");
    spec.addCapabilities("beam:version:sdk_base:apache/beam_javascript_sdk:2.23.0.dev");
    // TODO: add proper capabilities
    return spec
  }
}

export class ExternalEnvironment extends Environment {
  url: string = "INVALID";

  _urn() {
    return urns.StandardEnvironments.EXTERNAL;
  }

  _payload() {
    const payload = new beam_runner_api_pb.ExternalPayload();
    const descriptor = new ApiServiceDescriptor();
    descriptor.setUrl(this.url);
    payload.setEndpoint(descriptor);
    return payload.serializeBinary();
  }
}