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
import { PTransform, PTransformExpandFn, CallableWrapperPTransform } from '../transforms/ptransform'
import { PValue } from '../pcollection/pvalue'
import { PipelineContext } from './pipeline-context';
import { AppliedPTransform } from './applied-ptransform';
import { PipelineOptions } from './pipeline-options';
import { PipelineRunner } from '../runner/pipeline-runner';
import { PBegin } from '../pcollection/pvalue';

export type PValueish = PValue | Pipeline

export class Pipeline {
  /** Steps for this pipeline. */
  transformsStack: AppliedPTransform[] = [];

  /** Set of transform labels applied to the pipeline. */
  appliedLabels: Set<string> = new Set();

  /** Pipeline context -- used for generating unique refs. */
  context: PipelineContext = new PipelineContext();

  /** Pipeline options */
  options: PipelineOptions;

  /** Pipeline runner */
  runner: PipelineRunner;

  constructor(options: PipelineOptions = new PipelineOptions()) {
    this.runner = options.runner;
    this.options = options;

    const rootTransform = new AppliedPTransform(undefined, new PTransform({pipeline: this}), "ttt", []);
    rootTransform.fullLabel = "";
    rootTransform.ref = this.context.createUniqueRef(rootTransform);
    this.transformsStack.push(rootTransform);
  }

  _currentTransform() {
    return this.transformsStack[this.transformsStack.length - 1];
  }

  _rootTransform() {
    return this.transformsStack[0];
  }

  /**
   * Add a step to the pipeline.
   * @param {PTransform} PTransform.
   * @param {string} Label of the PTransform.
   * @param {PValue} Input for the PTransform, typically a PCollection.
   * @returns {Pipeline_} Serialized pipeline proto
   */
  apply(transformClassOrFn: typeof PTransform | PTransformExpandFn, { label, pvalueish, ...props}: {label?: string, pvalueish?: PValueish, [x: string]: any} = {}) {
    
    // Create appropriate transform, based on whether the input is an actual
    // PTransform class or just an expand function.
    let transform;
    if (transformClassOrFn.prototype.extractInputPValues) {
      transformClassOrFn = transformClassOrFn as typeof PTransform;
      transform = new transformClassOrFn({...props, pipeline: this});

    } else {
      transformClassOrFn = transformClassOrFn as PTransformExpandFn;
      transform = new CallableWrapperPTransform({ func: transformClassOrFn, pipeline: this });
    }

    const fullLabel = [this._currentTransform().fullLabel, (label || transform.constructor.name)].filter(e => e !== "").join("/");
    if (this.appliedLabels.has(fullLabel)) {
      throw new Error("label is already in use");
    }

    if (pvalueish instanceof Pipeline) {
      pvalueish = new PBegin({ pipeline: pvalueish });
    }
    let inputs = transform.extractInputPValues(pvalueish);
    const appliedPTransform = new AppliedPTransform(this._currentTransform(), transform, fullLabel, inputs);
    appliedPTransform.ref = this.context.createUniqueRef(appliedPTransform, fullLabel);

    // Add coders and windowing strategies to registry
    // TODO: don't unnecessarily create duplicate coders
    transform.getCoder().ref = this.context.createUniqueRef(transform.getCoder());
    transform.getWindowing().ref = this.context.createUniqueRef(transform.getWindowing());
    transform.getWindowing().getWindowCoder().ref = this.context.createUniqueRef(transform.getWindowing().getWindowCoder());

    this.appliedLabels.add(fullLabel);
    this._currentTransform().addPart(appliedPTransform);
    this.transformsStack.push(appliedPTransform);

    const pvalueResult = this.runner.apply({
      transform,
      pvalueish: pvalueish || this,
      options: this.options
    });

    appliedPTransform.addOutput(pvalueResult);

    this.transformsStack.pop();

    return pvalueResult;
  }

  /**
   * Serializes this pipeline to a runner api proto.
   * @returns {Pipeline_} Serialized pipeline proto
   */
  serialize() {
    const { context } = this;
    const pipeline = new beam_runner_api_pb.Pipeline();

    const components = new beam_runner_api_pb.Components();
    for (let ref in this.context.transforms) {
      components.getTransformsMap().set(ref, this.context.transforms[ref].serialize(context));
    }
    for (let ref in this.context.pcollections) {
      components.getPcollectionsMap().set(ref, this.context.pcollections[ref].serialize(context));
    }
    for (let ref in this.context.windowingStrategies) {
      components.getWindowingStrategiesMap().set(ref, this.context.windowingStrategies[ref].serialize(context));
    }
    for (let ref in this.context.coders) {
      components.getCodersMap().set(ref, this.context.coders[ref].serialize(context));
    }
    // TODO: other parts of context, like coders
    pipeline.setComponents(components);
    pipeline.setRootTransformIdsList([this._rootTransform().ref]);

    // StandardPTransforms.Primitives.MAP_WINDOWS
    return pipeline
  }

  /**
   * Clones this pipeline.
   * @returns {Pipeline} Cloned pipeline
   */
  clone() {
    const p = new Pipeline()
    // p._steps = [...this._steps]
    return p
  }

  /**
   * Builds this pipeline.
   * @returns {object} Object representing serialized pipeline
   */
  build() {
    return this.serialize().toObject()
  }

  /**
   * Runs this pipeline.
   */
  async run() {
    return this.runner.runPipeline(this, this.options);
  }
}
