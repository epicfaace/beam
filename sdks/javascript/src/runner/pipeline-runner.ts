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

import { PTransform } from '../transforms';
import { PipelineOptions } from '../pipeline/pipeline-options';
import { AppliedPTransform } from '../pipeline/applied-ptransform';
import { PValueish } from '../pipeline';
import { PBegin, PValue } from '../pcollection/pvalue';
import { Pipeline } from '../pipeline';

/**
 * A runner of a pipeline object.

  The base runner provides a run() method for visiting every node in the
  pipeline's DAG and executing the transforms computing the PValue in the node.

  A custom runner will typically provide implementations for some of the
  transform methods (ParDo, GroupByKey, Create, etc.). It may also
  provide a new implementation for clear_pvalue(), which is used to wipe out
  materialized values in order to reduce footprint.
 */
export class PipelineRunner {

  /**
   * Runs the entire pipeline.
   * @param {Pipeline} pipeline Pipeline to run
   * @param {PipelineOptions} options Pipeline options 
   */
  async runPipeline(_pipeline: Pipeline, _options?: PipelineOptions) {
    throw new Error("Subclasses should implement this method");
  }

  /**
   * Runner callback for a pipeline.apply call. Implementors may want
   * to override this method to create custom apply behavior for different
   * types of transforms.
   * @param {PTransform} transform PTransform to apply
   * @param {PValue} pvalueish Input for the PTransform
   * @param {PipelineOptions} options Pipeline options
   */
  apply({transform, pvalueish}: {transform: PTransform, pvalueish: PValueish, options?: PipelineOptions}) {
    const pvalue: PValue = pvalueish instanceof Pipeline ? new PBegin({ pipeline: pvalueish }) : pvalueish;
    return transform.expand(pvalue);
  }

  async runTransform(_transformNode: AppliedPTransform, _options?: PipelineOptions) {
    throw new Error("should be implemented in subclasses");
  }

}