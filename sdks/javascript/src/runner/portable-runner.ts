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
import { StartWorkerRequest } from '../model/generated/beam_fn_api_pb';
import { CommitManifestRequest } from '../model/generated/beam_artifact_api_pb';
import { PrepareJobRequest } from '../model/generated/beam_job_api_pb';
import { JobServiceClient } from '../model/generated/beam_job_api_grpc_pb';
import grpc from "grpc";
// import { promisify } from "util";

const credentials = grpc.credentials.createInsecure();

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
    console.log(req, jobEndpoint);

    // From JobServieHandle

    // Prepare
    const prepareJobRequest = new PrepareJobRequest();
    prepareJobRequest.setJobName("job");
    prepareJobRequest.setPipeline(pipeline.serialize());
    const client = new JobServiceClient(jobEndpoint, credentials);
    // client.prepare(prepareJobRequest, (response) => {
    //   console.error(response);
    // })
    const prepareJobResponse = await new Promise((resolve) =>
      client.prepare(prepareJobRequest, e => resolve(e))
    );
    // const prepareJobResponse = await promisify(client.prepare).bind(client)(prepareJobRequest);
    console.error(prepareJobResponse);

    // Stage

    // Run

    CommitManifestRequest
    
    console.log("todo implement");
  }

  async runTransform(_transformNode: AppliedPTransform, _options?: PipelineOptions) {
    throw new Error("todo implement");
  }
}