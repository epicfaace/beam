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


import { CallableWrapperDoFn } from '../specs/dofn'
import { ParDo } from './pardo';
import { Pipeline } from '../pipeline';
import { PTransform } from './ptransform';
import { PValue } from '../pcollection/pvalue';


export class FlatMap extends PTransform {
  func: (e?: any) => any;

  constructor({ func, ...parentProps }: { func: (e?: any) => any, pipeline: Pipeline }) {
    super(parentProps);
    this.func = func;
  }

  expand(input: PValue) {
    return input.apply(ParDo, {
      doFn: new CallableWrapperDoFn(this.func)
    });
  }
}