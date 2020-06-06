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

import { Pipeline, ParDo, DoFn, PTransform, Impulse, Create } from '../src/index'
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
    p.apply(ParDo, { doFn: new DoFn(), label: "custom label"});
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  it('with multiple subtransforms', () => {
    let p = new Pipeline();
    
    let pcoll = p.apply(ParDo, { doFn: new DoFn(), label: "A"});
    
      pcoll.apply(ParDo, { doFn: new DoFn(), label: "B-1"})
      .apply(ParDo, { doFn: new DoFn(), label: "C-1"});

      pcoll.apply(ParDo, { doFn: new DoFn(), label: "B-2"})
      .apply(ParDo, { doFn: new DoFn(), label: "C-2"});
    // console.error(pcoll.serialize().toObject());
    expect(p.serialize().toObject()).toMatchSnapshot();
  });

  it('with custom ptransform', () => {
    let p = new Pipeline();
        
    class CustomTransform extends PTransform {
      expand(pcoll: PCollection) {
        return pcoll.apply(ParDo, { doFn: new DoFn(), label: "nested subtransform 1"});
      }
    }
    p.apply(ParDo, { doFn: new DoFn(), label: "test"});

      p.apply(CustomTransform, { label: "custom transform" })
    expect(p.serialize().toObject()).toMatchSnapshot();
  });

  it('with ptransform with nothing', () => {
    let p = new Pipeline();
    class CustomTransform extends PTransform {
      expand(pcoll: PCollection) {
        return pcoll;
      }
    }
    p.apply(CustomTransform, { label: "custom transform" })
    expect(p.serialize().toObject()).toMatchSnapshot();
  });

  it('with a functional ptransform', () => {
    let p = new Pipeline();
    const customTransform = (pcoll: PCollection) => pcoll;
    p.apply(customTransform, { label: "custom transform" })
    expect(p.serialize().toObject()).toMatchSnapshot();
  });

  it('with ptransform with impulse', () => {
    let p = new Pipeline();
    class CustomTransform extends PTransform {
      expand(pcoll: PCollection) {
        return pcoll.apply(Impulse);
      }
    }
    p.apply(CustomTransform, { label: "custom transform" })
    expect(p.serialize().toObject()).toMatchSnapshot();
  });

  it('with create and print', () => {
    let p = new Pipeline();
    p.apply(Create, { values: ["a", "b", "c"] });
    expect(p.serialize().toObject()).toMatchSnapshot();
  });
  // it('with pipeline operator', () => {
  //   let p = new Pipeline() |> Create(['a', 'b', 'c']);
  //   console.log(p.build())
  
  //   expect(1 + 1).toEqual(2);
  // });
})


/*

https://2ality.com/2011/12/fake-operator-overloading.html

p |> Beam.createTransform(Create, {"label": "label 1"} )

(
  p
  |> "test" >> Create(["a", "b", "c"])
)

p.apply(Create, {
  "label": "label 1"
})


*/