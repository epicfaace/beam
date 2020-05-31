import { PipelineRunner } from './pipeline-runner';
import { PipelineOptions } from '../pipeline/pipeline-options';
import { Pipeline } from '../pipeline';
import { AppliedPTransform } from '../pipeline/applied-ptransform';

export class DirectRunner extends PipelineRunner {
  async runPipeline(_pipeline: Pipeline, _options?: PipelineOptions) {
    throw new Error("todo implement");
  }

  async runTransform(_transformNode: AppliedPTransform, _options?: PipelineOptions) {
    throw new Error("todo implement");
  }
}