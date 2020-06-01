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

import { PipelineRunner } from './pipeline-runner';
import { PipelineOptions } from '../pipeline/pipeline-options';
import { Pipeline } from '../pipeline';
import { AppliedPTransform } from '../pipeline/applied-ptransform';
import beam_runner_api_pb from '../model/generated/beam_runner_api_pb';
import urns from '../model/urns';
import { Impulse } from '../transforms';
import { PBegin } from '../pcollection/pvalue';


class Stage {
  name: string;
  transforms: beam_runner_api_pb.PTransform[]
  constructor(name: string, transforms: beam_runner_api_pb.PTransform[]) {
    this.name = name;
    this.transforms = transforms;
  }
}

const KNOWN_COMPOSITES: string[] = [];

function *leafTransformStages (rootIds: string[], components?: beam_runner_api_pb.Components): Generator<Stage> {
  components = components || new beam_runner_api_pb.Components();
  for (let rootId of rootIds) {
    const root = components.getTransformsMap().get(rootId);
    if (!root) {
      throw new Error("Transform with id " + rootId + " not found");
    }
    const urn = root.hasSpec() ? root!.getSpec()!.getUrn(): "";
    if (KNOWN_COMPOSITES.indexOf(urn) > -1) {
      yield new Stage(rootId, [root]);
    } else if (!root.getSubtransformsList().length) {
      // TODO: "Make sure its outputs are not a subset of its inputs."?
      yield new Stage(rootId, [root]);
    } else {
      yield* leafTransformStages(root.getSubtransformsList(), components); 
    }
  }
}

/**
 * DirectRunner that runs pipelines using the Fn API.
 */
export class DirectRunner extends PipelineRunner {
  numWorkers = 1;

  async runPipeline(pipeline: Pipeline, _options: PipelineOptions) {
    // TODO: validate requirements
    // TODO: check requirements
    // const stages = this._createStages(pipeline.serialize());
    const pipelineProto = pipeline.serialize();
    const stages = leafTransformStages(
      pipelineProto.getRootTransformIdsList(),
      pipelineProto.getComponents());
    let ctx: any = {
      transforms: {},
      pcollections: {}
    };
    // TODO: use FN API with processbundlerequest, etc.
    for (let stage of stages) {
      const transform = stage.transforms[0] as beam_runner_api_pb.PTransform;
      let inputsList = transform.getInputsMap().getEntryList();
      let outputsList = transform.getOutputsMap().getEntryList();
      let inputRef = inputsList.length ? inputsList[0][1]: null;
      let input = inputRef === null ? null : ctx.pcollections[inputRef];
      let outputRef = outputsList.length ? outputsList[0][1]: null;
      let output: any = null;
      switch (transform.getSpec()!.getUrn()) {
        case urns.StandardPTransforms.Primitives.PAR_DO:
          const {urn, payload} = JSON.parse(transform.getSpec()!.getPayload() as string).doFn;
          if (urn !== "beam:dofn:javascript:v1") {
            throw new Error("this dofn urn is not supported: " + urn);
          }
          let fn = new Function("return " + payload)();
          // output = input.map(e => )
          // TODO: run on multiple inputs / elements -- need to iterate over pcollection.
          output = fn(input);
          break;
        case urns.StandardPTransforms.Primitives.IMPULSE:
          output = new Impulse({ pipeline }).expand(new PBegin({ pipeline }));
          break;
        default:
          throw new Error("PTransform not supported.");
      }
      if (outputRef !== null) {
        ctx.pcollections[outputRef] = output;
      }
    }
    // console.error(stages);
  }

  async runTransform(_transformNode: AppliedPTransform, _options?: PipelineOptions) {
    throw new Error("todo implement");
  }
}