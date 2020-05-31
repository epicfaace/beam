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
  constructor(_props?: any) {
    super()
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
   * Extract all the pvalues contained in the input pvalueish.

    Returns pvalueish as well as the flat inputs list as the input may have to
    be copied as inspection may be destructive.

    By default, recursively extracts tuple components and dict values.

    Generally only needs to be overriden for multi-input PTransforms.
  */
  extractInputPValues(pvalueish?: PValueish): PValue[] {
    if (!pvalueish) {
      return [];
    }
    if (pvalueish instanceof Pipeline) {
      return []; // TODO: PBegin?
    }
    const isIterable = (object: any) => object != null && typeof object[Symbol.iterator] === 'function';
    const dictTupleLeaves = (pvalueish: any): any => {
      if (isIterable(pvalueish)) {
        return pvalueish.map((e: any) => dictTupleLeaves(e));
      }
      if (pvalueish.constructor == Object) {
        return dictTupleLeaves(Object.values(pvalueish));
      }
      return pvalueish;
    }
    return [dictTupleLeaves(pvalueish)];
  }
}
