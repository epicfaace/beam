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

import beam_runner_api_pb from "../model/generated/beam_runner_api_pb";
import { PValue } from './pvalue';

/**
 * A multiple values (potentially huge) container.
 */
export class PCollection extends PValue {
  bounded = true;
  tag = "None";
  
  serialize() {
    let pb = new beam_runner_api_pb.PCollection();
    pb.setUniqueName(this.ref); // 14Create/Impulse.None
    pb.setCoderId("TODO"); // ref_Coder_BytesCoder_1
    pb.setIsBounded(beam_runner_api_pb.IsBounded.Enum.BOUNDED);
    pb.setWindowingStrategyId("TODO"); // ref_Windowing_Windowing_1
    return pb;
  }
}