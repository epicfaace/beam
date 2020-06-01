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

import { PTransform } from './ptransform'
import { GlobalWindows, Windowing } from '../windowing';
import { PValueish } from '../pipeline';
import { PBegin } from '../pcollection/pvalue';
import { PCollection } from '../pcollection';
import urns from '../model/urns';

/*
 * Impulse primitive.
 * @extends PTransform
 */
export class Impulse extends PTransform {

  _urn() {
    return urns.StandardPTransforms.Primitives.IMPULSE;
  }

  _payload() {
    return "";
  }

  expand(input: PValueish) {
    if (!(input instanceof PBegin)) {
      throw new Error("Input to Impulse transfer must be a PBegin");
    }
    return new PCollection({ pipeline: input.pipeline });
  }

  getWindowing() {
    return new Windowing(new GlobalWindows());
  }
}
