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

import { Pipeline, ParDo, Impulse } from '../src/index';
import { PipelineOptions } from '../src/pipeline/pipeline-options';
import { PortableRunner } from '../src/runner/portable-runner';

describe.skip('Direct runner', () => {
  it('run simple dofn', async () => {
    let p = new Pipeline();
    function process(element: any) {
      console.log('test hello world ' + element.constructor.name);
    }
    p.apply(Impulse).apply(ParDo, {
      doFn: process,
    });
    await p.run();
  });
});

describe.only('Portable runner', () => {
  it('run simple dofn', async () => {
    let p = new Pipeline(
      new PipelineOptions({
        runner: new PortableRunner(),
        jobEndpoint: 'localhost:8099',
        environmentType: 'LOOPBACK',
      })
    );
    function process(element: any) {
      console.log('test hello world ' + element.constructor.name);
    }
    p.apply(Impulse).apply(ParDo, {
      doFn: process,
    });
    // p.apply(Impulse);
    
    /*
    TODO:
    java.lang.IllegalArgumentException: Transform ref_AppliedPTransform_ParDo_8 has unknown URN beam:transform:pardo:v1
        at org.apache.beam.runners.spark.translation.SparkBatchPortablePipelineTranslator.urnNotFound(SparkBatchPortablePipelineTranslator.java:145)
        
    */
    await p.run();
  });
});

/**
 * https://beam.apache.org/documentation/runners/spark/

 brew cask install adoptopenjdk/openjdk/adoptopenjdk8
 jenv add /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/contents/home
./gradlew :runners:spark:job-server:runShadow


yarn test runner --watch

*/
