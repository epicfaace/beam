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

import { Pipeline, ParDo, DoFn, PTransform, Impulse } from '../src/index'
import { PCollection } from '../src/pcollection';

describe('Pipeline', () => {
  // it('no pipeline operator', () => {
  //   let p = new Pipeline();// |> Create(['a', 'b', 'c']);
  //   p = Create(['a', 'b', 'c'])(p)
  
  //   expect(p.serialize()).toMatchSnapshot();
  // });
  it('empty with single root transform', () => {
    let p = new Pipeline();
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  it('with one transform', () => {
    let p = new Pipeline();
    p.apply({ transform: new ParDo({ doFn: new DoFn(), pipeline: p }), label: "custom label"});
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  it('with multiple subtransforms', () => {
    let p = new Pipeline();
    
    let pcoll = p.apply({ transform: new ParDo({ doFn: new DoFn(), pipeline: p }), label: "A" });
    
      pcoll.apply({ transform: new ParDo({ doFn: new DoFn(), pipeline: p }), label: "B-1"})
      .apply({ transform: new ParDo({ doFn: new DoFn(), pipeline: p }), label: "C-1"});

      pcoll.apply({ transform: new ParDo({ doFn: new DoFn(), pipeline: p }), label: "B-2"})
      .apply({ transform: new ParDo({ doFn: new DoFn(), pipeline: p }), label: "C-2"});
    // console.error(pcoll.serialize().toObject());
    expect(p.serialize().toObject()).toMatchSnapshot();
  });

  it('with custom ptransform', () => {
    let p = new Pipeline();
        
    class CustomTransform extends PTransform {
      expand(pcoll: PCollection) {
        return pcoll.apply({ transform: new ParDo({ doFn: new DoFn(), pipeline: p }), label: "nested subtransform 1"});
      }
    }
    p.apply({ transform: new ParDo({ doFn: new DoFn(), pipeline: p }), label: "test"});

      p.apply({ transform: new CustomTransform({ pipeline: p }), label: "custom transform" })
    expect(p.serialize().toObject()).toMatchSnapshot();
  });

  it('with ptransform with nothing', () => {
    let p = new Pipeline();
    class CustomTransform extends PTransform {
      expand(pcoll: PCollection) {
        return pcoll;
      }
    }
    p.apply({ transform: new CustomTransform({ pipeline: p }), label: "custom transform" })
    expect(p.serialize().toObject()).toMatchSnapshot();
  });

  it('with ptransform with impulse', () => {
    let p = new Pipeline();
    class CustomTransform extends PTransform {
      expand(pcoll: PCollection) {
        return pcoll.apply({ transform: new Impulse({ pipeline: p}) });
      }
    }
    p.apply({ transform: new CustomTransform({ pipeline: p }), label: "custom transform" })
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  // it('with pipeline operator', () => {
  //   let p = new Pipeline() |> Create(['a', 'b', 'c']);
  //   console.log(p.build())
  
  //   expect(1 + 1).toEqual(2);
  // });
})
