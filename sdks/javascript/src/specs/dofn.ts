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

import { FunctionSpec } from './function-spec'
import { CUSTOM_JS_DOFN_URN } from '../model/urns'

export class DoFn extends FunctionSpec {
  constructor() {
    super()
    // TODO: allow passing in function here.
  }

  _urn() {
    return CUSTOM_JS_DOFN_URN
  }

  _payload() {
    // Call function by doing new Function("return " + this.toString())()(args)
    return this.process.toString();
  }

  process(_element: any): any {
    throw new Error('Needs to be implemented in subclasses')
  }

  // TODO: add setup, start_bundle, finish_bundle, teardown.
}

export class CallableWrapperDoFn extends DoFn {
  constructor(func: () => any) {
    super();
    this.process = func;
  }
}