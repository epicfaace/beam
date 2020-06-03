import { DescribePipelineOptionsRequest, DescribePipelineOptionsResponse, PrepareJobResponse, PrepareJobRequest, RunJobRequest, RunJobResponse, GetJobStateRequest, JobMessagesRequest } from '../model/generated/beam_job_api_pb';
import { Pipeline } from '../pipeline';
import { JobServiceClient } from '../model/generated/beam_job_api_grpc_pb';
import { Struct } from 'google-protobuf/google/protobuf/struct_pb';
import grpc from "grpc";
import { ArtifactStagingServiceClient } from '../model/generated/beam_artifact_api_grpc_pb';

export class JobServiceHandle {
  client: JobServiceClient;
  artifactClient: ArtifactStagingServiceClient;

  constructor({ jobEndpoint }: { jobEndpoint: string }) {
    const credentials = grpc.credentials.createInsecure();
    this.client = new JobServiceClient(jobEndpoint, credentials);
    this.artifactClient = new ArtifactStagingServiceClient(jobEndpoint, credentials);
  }

  async prepare({ pipeline }: { pipeline: Pipeline }) {
    // 0. Get options
    // const describeOptionsRequest = new DescribePipelineOptionsRequest();
    // const describeOptionsResponse: DescribePipelineOptionsResponse = await new Promise((resolve, reject) =>
    //   this.client.describePipelineOptions(describeOptionsRequest, (err, res) => err ? reject(err): resolve(res))
    // );
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

    const prepareJobResponse: PrepareJobResponse = await new Promise((resolve, reject) =>
      this.client.prepare(prepareJobRequest, (err, res) => err ? reject(err): resolve(res))
    );
    return prepareJobResponse;
  }

  async stage() {
    // TODO: implement.
    
  }

  async run({ preparationId, retrievalToken }: { preparationId: string, retrievalToken: string }) {
    const getJobStateRequest = new GetJobStateRequest()
    getJobStateRequest.setJobId(preparationId);
    const stateStream = this.client.getStateStream(getJobStateRequest);

    const jobMessagesRequest = new JobMessagesRequest();
    jobMessagesRequest.setJobId(preparationId);
    const messageStream = this.client.getMessageStream(jobMessagesRequest);
    
    const runJobRequest = new RunJobRequest();
    runJobRequest.setPreparationId(preparationId);
    runJobRequest.setRetrievalToken(retrievalToken);
    // runJobRequest.setRetrievalToken(); // need if we have artifacts staged
    const runJobResponse: RunJobResponse = await new Promise((resolve, reject) =>
      this.client.run(runJobRequest, (err, res) => err ? reject(err): resolve(res))
    );

    return { runJobResponse, stateStream, messageStream };
  }
}