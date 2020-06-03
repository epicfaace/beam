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

import { PipelineRunner } from './pipeline-runner';
import { PipelineOptions } from '../pipeline/pipeline-options';
import { Pipeline } from '../pipeline';
import { AppliedPTransform } from '../pipeline/applied-ptransform';
import { StartWorkerRequest, StartWorkerResponse } from '../model/generated/beam_fn_api_pb';
import { PrepareJobRequest, PrepareJobResponse, RunJobRequest, RunJobResponse, DescribePipelineOptionsRequest, DescribePipelineOptionsResponse } from '../model/generated/beam_job_api_pb';
import { WorkerPool } from "./worker/worker-pool";

import { ArtifactStagingServiceClient } from '../model/generated/beam_artifact_api_grpc_pb'
import { ExternalEnvironment } from '../environment';
import { JobServiceHandle } from './job-service-handle';
import { ClientReadableStream } from 'grpc';


/**
 * A BeamRunner that executes Python pipelines via the Beam Job API.
 * 
 * This runner is a stub and does not run the actual job.
 * This runner schedules the job on a job service. The responsibility of
 * running and managing the job lies with the job service used.
 */
export class PortableRunner extends PipelineRunner {
  numWorkers = 1;

  async runPipeline(pipeline: Pipeline, options: PipelineOptions) {
    // TODO: validate requirements
    // TODO: check requirements
    // const stages = this._createStages(pipeline.serialize());
    const { environmentType, jobEndpoint } = options;
    if (environmentType !== "LOOPBACK") {
      throw new Error("Only environmentType=LOOPBACK is supported.");
    }
    const req = new StartWorkerRequest();
    // req.se
    // const service = BeamFnExternalWorkerPoolService.startWorker()
    // TODO: start BeamFnExternalWorkerPoolServicer
    if (false) console.log(req, jobEndpoint);

    // From JobServiceHandle

    const pool = new WorkerPool();
    const port = pool.start();
    // TODO: clean this up
    (pipeline.context.environments[Object.keys(pipeline.context.environments)[0]] as ExternalEnvironment).url = `localhost:${port}`;

    let jobServiceHandle = new JobServiceHandle({ jobEndpoint });

    // 1. Prepare
    const prepareJobResponse = await jobServiceHandle.prepare({ pipeline });

    // 2. Stage
    await jobServiceHandle.stage();

    // 3. Run
    const {runJobResponse, stateStream, messageStream} = await jobServiceHandle.run({
      preparationId: prepareJobResponse.getPreparationId(),
      retrievalToken: ""
    });
    console.error(runJobResponse.getJobId());

    const streamToPromise = (stream: ClientReadableStream<any>, label: string) => new Promise((resolve, reject) => {
      stream.on('end', function() {
        console.error(label + " stream end");
        resolve();
      });
      stream.on('error', function(e) {
        console.error(label + " stream error", e)
        reject(e);
      });
      stream.on('status', function(status) {
        console.error(label + " stream status", status);
      });
      stream.on('data', function(status) {
        console.error(label + " stream data", status);
      });
    });

    await Promise.all([
      streamToPromise(stateStream, "stateStream"),
      streamToPromise(messageStream, "messageStream")
    ]);


  }

  async runTransform(_transformNode: AppliedPTransform, _options?: PipelineOptions) {
    throw new Error("todo implement");
  }
}