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
import { PrepareJobRequest, PrepareJobResponse, RunJobRequest, RunJobResponse, DescribePipelineOptionsRequest, DescribePipelineOptionsResponse } from '../model/generated/beam_job_api_pb';
import { JobServiceClient } from '../model/generated/beam_job_api_grpc_pb';
import { ArtifactStagingServiceClient } from '../model/generated/beam_artifact_api_grpc_pb'
import grpc from "grpc";
import { Struct } from 'google-protobuf/google/protobuf/struct_pb';
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
    if (false) console.log(req, jobEndpoint);

    // From JobServiceHandle

    let jobServiceClient = new JobServiceClient(jobEndpoint, credentials);


    // 0. Get options
    const describeOptionsRequest = new DescribePipelineOptionsRequest();
    const describeOptionsResponse: DescribePipelineOptionsResponse = await new Promise((resolve, reject) =>
    jobServiceClient.describePipelineOptions(describeOptionsRequest, (err, res) => err ? reject(err): resolve(res))
    );
    // console.error("describeOptionsResponse", describeOptionsResponse.toObject());
    let optionsDict: any = {};
    // for (let item of describeOptionsResponse.getOptionsList()) {
    //   optionsDict[item.getName()] = item.getDefaultValue();
    // }
    // optionsDict.job_endpoint = jobEndpoint;
    // console.error(optionsDict);
    // 1. Prepare
    const prepareJobRequest = new PrepareJobRequest();
    prepareJobRequest.setJobName("job");
    prepareJobRequest.setPipeline(pipeline.serialize());
    prepareJobRequest.setPipelineOptions(Struct.fromJavaScript(optionsDict));
    // client.prepare(prepareJobRequest, (response) => {
    //   console.error(response);
    // })
    const prepareJobResponse: PrepareJobResponse = await new Promise((resolve, reject) =>
      jobServiceClient.prepare(prepareJobRequest, (err, res) => err ? reject(err): resolve(res))
    );
    // const prepareJobResponse = await promisify(client.prepare).apply(client, [prepareJobRequest]);
    console.log(prepareJobResponse.getPreparationId())
    
    // 2. Stage
    let artifactClient = new ArtifactStagingServiceClient(jobEndpoint, credentials);
    // const stageJobResponse = await new Promise((resolve) => 
    //   artifactClient.
    // )
    // const prepareJobResponse = await promisify(client.prepare).bind(client)(prepareJobRequest);
    if (false) console.error(artifactClient);

    // 3. Run
    const runJobRequest = new RunJobRequest();
    runJobRequest.setPreparationId(prepareJobResponse.getPreparationId());
    runJobRequest.setRetrievalToken("");
    // runJobRequest.setRetrievalToken(); // need if we have artifacts staged
    const runJobResponse: RunJobResponse = await new Promise((resolve, reject) =>
      jobServiceClient.run(runJobRequest, (err, res) => err ? reject(err): resolve(res))
    );
    console.error(runJobResponse);


    // Stage

    // Run

    CommitManifestRequest
    
    console.log("todo implement");
  }

  async runTransform(_transformNode: AppliedPTransform, _options?: PipelineOptions) {
    throw new Error("todo implement");
  }
}