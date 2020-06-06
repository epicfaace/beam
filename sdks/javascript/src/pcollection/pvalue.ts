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

import { Pipeline } from '../pipeline';
import { PTransform } from '../transforms';
import { PTransformExpandFn } from '../transforms/ptransform';
import { PipelineContext } from '../pipeline/pipeline-context';

/**
 * Base class for PCollection.
 */
export class PValue {
  pipeline: Pipeline;
  ref: string;
  
  constructor({ pipeline } : { pipeline: Pipeline }) {
    this.pipeline = pipeline;
    this.ref = pipeline.context.createUniqueRef(this);
  }

  /**
   * Applies a transform to a PValue.

    The method will insert the pvalue as the argument for pvalueish, then
    call the pipeline.apply() method with this modified argument list.
   * @param opts 
   */
  apply(transformClassOrFn: typeof PTransform | PTransformExpandFn, { label, pvalueish, ...props}: {label?: string, [x: string]: any} = {}) {
    return this.pipeline.apply(transformClassOrFn, {...props, label, pvalueish: this});
  }

  serialize(_context: PipelineContext): any {
    return null;
    // throw new Error("Should be implemented by PCollection");
  }
}

/**
 * Marks the beginning of a pipeline.
 */
export class PBegin extends PValue {
  
}