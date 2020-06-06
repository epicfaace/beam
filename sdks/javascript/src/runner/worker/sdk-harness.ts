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

import grpc, { Metadata } from "grpc";
import { BeamFnControlClient, BeamFnDataClient } from '../../model/generated/beam_fn_api_grpc_pb';
import { streamToPromise } from '../portable-runner';
import { InstructionResponse, InstructionRequest, GetProcessBundleDescriptorRequest, ProcessBundleDescriptor } from '../../model/generated/beam_fn_api_pb';


const credentials = grpc.credentials.createInsecure();

/**
 * SDK harness for use with the Fn API.
 */
export class SDKHarness {
  controlAddress: string;
  workerId: string;

  constructor({ controlAddress, workerId }: { controlAddress: string, workerId: string }) {
    this.controlAddress = controlAddress;
    this.workerId = workerId;
    // const runJobRequest = new RunJobRequest();
    // runJobRequest.setPreparationId(preparationId);
    // runJobRequest.setRetrievalToken(retrievalToken);
    // // runJobRequest.setRetrievalToken(); // need if we have artifacts staged
    // const runJobResponse: RunJobResponse = await new Promise((resolve, reject) =>
    //   this.client.run(runJobRequest, (err, res) => err ? reject(err): resolve(res))
    // );
  }

  async run() {
    const responses = [];

    // Intercept with worker id https://github.com/apache/beam/commit/1f52bb80f76c9fea03ece05caf5c86cd38a08dd9
    // See https://gist.github.com/axw/bc5025035fbd2cea6a4516349be8a7ce
    const interceptor = (options: any, nextCall: any) => new grpc.InterceptingCall(nextCall(options), {
      start: (metadata, listener, next) => {
        metadata.add("worker_id", this.workerId);
        next(metadata, listener, next);
      }
    });
    const options = { interceptors: [ interceptor ] };
    
    const controlClient = new BeamFnControlClient(this.controlAddress, credentials, options);
    const controlStream = controlClient.control();

    const dataClient = new BeamFnDataClient(this.controlAddress, credentials, options);
    const dataStream = dataClient.data();

    controlStream.on("data", async (e: InstructionRequest) => {
      // console.error("instructionRequest", e.toObject());
      const request = new GetProcessBundleDescriptorRequest();
      request.setProcessBundleDescriptorId(e.getProcessBundle()!.getProcessBundleDescriptorId());
      const processBundleDescriptor: ProcessBundleDescriptor = await new Promise((resolve, reject) =>
        controlClient.getProcessBundleDescriptor(request, (err, res) => err ? reject(err): resolve(res))
      );
      // console.error("processBundleDescriptor", processBundleDescriptor.toObject());
      // console.error("processBundleDescriptor", JSON.stringify(processBundleDescriptor.toObject()));
    });

    // TODO: add state handler, profiler channels;

    await Promise.all([
      streamToPromise(controlStream, "controlStream"),
      streamToPromise(dataStream, "dataStream", false)
    ]);
  }
}