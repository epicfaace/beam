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

import { Coder as Coder_, MergeStatus, AccumulationMode, OutputTime, ClosingBehavior, OnTimeBehavior, Trigger } from '../model/generated/beam_runner_api_pb';
import { FunctionSpec } from '../specs/function-spec';
import urns from '../model/urns';

class CoderSpec extends FunctionSpec {
  _urn() {
    return urns.StandardCoders.Enum.STRING_UTF8;
  }

  _payload() {
    return "";
  }
}

export default class Coder {
  spec: CoderSpec;

  constructor() {
    this.spec = new CoderSpec();
  }
  
  serialize() {
    const pb = new Coder_();
    pb.setSpec(this.spec.serialize());
    // pb.setComponentCoderIdsList([]); // TODO fix this
    return pb;
  }
}