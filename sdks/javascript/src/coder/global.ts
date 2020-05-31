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

import urns from '../model/urns';
import { CoderSpec, Coder } from './index';

class GlobalWindowCoderSpec extends CoderSpec {
  _urn() {
    return urns.StandardCoders.Enum.GLOBAL_WINDOW;
  }
  encode(value: any) {
    return value;
  }

  decode(encoded: any) {
    return encoded;
  }
}

export class GlobalWindowCoder extends Coder {
  spec: CoderSpec = new GlobalWindowCoderSpec();
}