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

import { FunctionSpec } from '../specs/function-spec'
import { CUSTOM_JS_TRANSFORM_URN } from '../model/urns'
import { Pipeline, PValueish } from '../pipeline'
import { PValue } from '../pcollection/pvalue'

export class PTransform extends FunctionSpec {
  pipeline: Pipeline;
  constructor(pipeline: Pipeline) {
    super();
    this.pipeline = pipeline;
    // TODO: add label argument here.
  }

  _urn() {
    return CUSTOM_JS_TRANSFORM_URN
  }

  _payload() {
    // TODO: use a custom protobuf format
    return this.expand.toString();
  }

  label() {
    return this.constructor.name;
  }

  expand(_input: PValueish): PValue {
    throw new Error("Must be implemented by subclasses");
  }

  /**
   * Extract all the pvalues contained in the input pvalue.

    By default, recursively extracts tuple components and dict values.

    Generally only needs to be overriden for multi-input PTransforms.
  */
  extractInputPValues(pvalue?: PValue): PValue[] {
    if (!pvalue) {
      return [];
    }
    const isIterable = (object: any) => object != null && typeof object[Symbol.iterator] === 'function';
    const dictTupleLeaves = (pvalue: any): any => {
      if (isIterable(pvalue)) {
        return pvalue.map((e: any) => dictTupleLeaves(e));
      }
      if (pvalue.constructor == Object) {
        return dictTupleLeaves(Object.values(pvalue));
      }
      return pvalue;
    }
    return [dictTupleLeaves(pvalue)];
  }
}
