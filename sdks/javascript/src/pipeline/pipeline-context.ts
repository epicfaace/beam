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

import { AppliedPTransform } from './applied-ptransform';
import { PCollection } from '../pcollection';
import { Windowing } from '../windowing';
import { Coder } from '../coder';
import { Environment } from '../environment';

export class PipelineContext {
  counter: number = 0;
  namespace: string = "ref";

  transforms: {[x: string]: AppliedPTransform} = {};

  pcollections: {[x: string]: PCollection} = {};

  windowingStrategies: {[x: string]: Windowing} = {};

  coders: {[x: string]: Coder} = {};

  environments: {[x: string]: Environment} = {};

  // TODO:
  // windowing_strategies
  // coders
  // environments
  
  /**
   * Create a unique ref for use within a pipeline.
   */
  createUniqueRef(object: Object, label?: string) {
    this.counter++;
    const ref = [this.namespace, object.constructor.name, label || object.constructor.name, this.counter].join("_");
    if (object instanceof AppliedPTransform) {
      this.transforms[ref] = object;
    } else if (object instanceof PCollection) {
      this.pcollections[ref] = object;
    } else if (object instanceof Windowing) {
      this.windowingStrategies[ref] = object;
    } else if (object instanceof Coder) {
      this.coders[ref] = object;
    } else if (object instanceof Environment) {
      this.environments[ref] = object;
    }
    return ref;
  }
}