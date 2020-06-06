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

import beam_runner_api_pb from '../model/generated/beam_runner_api_pb'
import urns from '../model/urns'
import { PTransform } from './ptransform'
import { DoFn, CallableWrapperDoFn, DoFnProcessFn } from '../specs/dofn'
import { PCollection } from '../pcollection'
import { PValue } from '../pcollection/pvalue'
import { Pipeline } from '../pipeline'
import { PipelineContext } from '../pipeline/pipeline-context'

export class ParDo extends PTransform {
  doFn: DoFn

  constructor({ doFn, ...parentProps }: { doFn: DoFn | DoFnProcessFn, pipeline: Pipeline }) {
    super(parentProps);

    // Create appropriate DoFn, based on whether the input is an actual
    // instance of DoFn class or just a process function.
    if (doFn instanceof DoFn) {
      this.doFn = doFn;
    } else {
      this.doFn = new CallableWrapperDoFn(doFn);
    }
  }

  _urn(): string {
    return urns.StandardPTransforms.Primitives.PAR_DO;
  }

  _payload() {
    const payload = new beam_runner_api_pb.ParDoPayload()
    payload.setDoFn(this.doFn.serialize(this.pipeline.context));
    // TODO: serialize doFn imports properly
    return payload.serializeBinary();
  }

  expand(input: PValue) {
    return new PCollection({ pipeline: input.pipeline });
  }
}