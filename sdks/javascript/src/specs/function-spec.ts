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

import { FunctionSpec as FunctionSpecProto } from '../model/generated/beam_runner_api_pb'

/**
 * A base class for classes that can be serialized to
 * a FunctionSpec proto.
 */
export class FunctionSpec {
  constructor(_props?: any) {}

  /**
   * Get the URN of this object.
   * @return {string} The object's URN.
   */
  _urn(): string {
    throw new Error('Needs to be implemented in subclasses')
  }

  /**
   * Get the payload of this object.
   * @return {string} The object's payload.
   */
  _payload(): string {
    throw new Error('Needs to be implemented in subclasses')
  }

  /**
   * Serialize this object to a protobuf.
   * @return {FunctionSpec_} The generated protobuf.
   */
  serialize() {
    const spec = new FunctionSpecProto();
    spec.setUrn(this._urn())
    if (this._payload() !== null) {
      const enc = new TextEncoder();
      const buf = enc.encode(this._payload()).buffer;
      spec.setPayload(new Uint8Array(buf));
      // spec.setPayload(this._payload() as string);
    }
    return spec
  }
}
