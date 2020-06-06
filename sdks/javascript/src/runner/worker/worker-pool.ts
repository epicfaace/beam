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

import grpc from "grpc";
import { BeamFnExternalWorkerPoolService, BeamFnExternalWorkerPoolClient, IBeamFnExternalWorkerPoolService } from '../../model/generated/beam_fn_api_grpc_pb';
import beam_fn_api_pb from '../../model/generated/beam_fn_api_pb';
import { SDKHarness } from './sdk-harness';

const serverCredentials = grpc.ServerCredentials.createInsecure();

export class WorkerPool {
  port?: number;

  start() {
    const server = new grpc.Server();
    server.addService(BeamFnExternalWorkerPoolService, {
      startWorker: this.startWorker,
      stopWorker: this.stopWorker
    });
    const port = server.bind("0.0.0.0:0", serverCredentials);
    this.port = port;
    server.start();
    console.error("port", port);
    return port;
  }

  startWorker(call: any, callback: any) {
    const request = call.request as beam_fn_api_pb.StartWorkerRequest;
    const sdkHarness = new SDKHarness({
      controlAddress: request.getControlEndpoint()!.getUrl(),
      workerId: request.getWorkerId()
    });
    sdkHarness.run();
    const response = new beam_fn_api_pb.StartWorkerResponse();
    callback(null, response);
  }

  /**
   * Stop worker. No need to do anything for async-based workers.
   * If we add process-based workers, we will need to kill the
   * workers' processes.
   * @param call 
   * @param callback 
   */
  stopWorker(call: any, callback: any) {
    const request = call.request as beam_fn_api_pb.StopWorkerRequest;
    const response = new beam_fn_api_pb.StopWorkerResponse();
    callback(null, response);
  }
}