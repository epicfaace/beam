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

import { WindowingStrategy, MergeStatus, AccumulationMode, OutputTime, ClosingBehavior, OnTimeBehavior } from '../model/generated/beam_runner_api_pb';
import { FunctionSpec } from '../specs/function-spec';
import urns from '../model/urns';
import { DefaultTrigger } from '../trigger';
import { GlobalWindowCoder } from '../coder/global';
import { Coder } from '../coder';
import { PipelineContext } from '../pipeline/pipeline-context';

class WindowFunction extends FunctionSpec {
  _payload() {
    return null;
  }

  getWindowCoder(): Coder {
    throw new Error("Needs to be implemented by subclasses");
  }
}

export class GlobalWindows extends WindowFunction {
  _urn() {
    return urns.GlobalWindowsPayload.Enum.PROPERTIES;
  }

  getWindowCoder() {
    return new GlobalWindowCoder();
  }
}

export class Windowing {
  windowFn: WindowFunction;
  ref: string = "";
  
  constructor(windowFn: WindowFunction) {
    this.windowFn = windowFn;
  }

  getWindowCoder() {
    return this.windowFn.getWindowCoder();
  }

  serialize(context: PipelineContext) {
    const pb = new WindowingStrategy();
    const windowFn = new GlobalWindows();
    const trigger = new DefaultTrigger();
    pb.setWindowFn(windowFn.serialize(context));
    pb.setMergeStatus(MergeStatus.Enum.NON_MERGING);
    pb.setWindowCoderId(Object.keys(context.coders)[0]);
    pb.setTrigger(trigger.serialize(context));
    pb.setAccumulationMode(AccumulationMode.Enum.DISCARDING);
    pb.setOutputTime(OutputTime.Enum.END_OF_WINDOW);
    pb.setClosingBehavior(ClosingBehavior.Enum.EMIT_ALWAYS);
    pb.setAllowedLateness(0);
    pb.setOntimebehavior(OnTimeBehavior.Enum.FIRE_ALWAYS);
    pb.setAssignsToOneWindow(true);
    return pb;
  }
}