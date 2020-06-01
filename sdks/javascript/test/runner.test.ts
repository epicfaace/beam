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

import { Pipeline, ParDo, DoFn, Impulse } from '../src/index'

describe('Runner', () => {
  it('run simple dofn', async () => {
    let p = new Pipeline();
    class CustomDoFn extends DoFn {
      process(element: any) {
        console.log("test hello world " + element.constructor.name );
      }
    }
    p.apply({
      transform: new Impulse({ pipeline: p })
    }).apply({
      transform: new ParDo({
        doFn: new CustomDoFn(),
        pipeline: p
      })
    });
    await p.run();
  });
})
