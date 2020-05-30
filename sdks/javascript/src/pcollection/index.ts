import { Pipeline } from 'pipeline';
import beam_runner_api_pb from "../model/generated/beam_runner_api_pb";

/**
 * Base class for PCollection.
 */
export class PValue {
  pipeline: Pipeline;
  name: string;
  constructor(pipeline: Pipeline) {
    this.pipeline = pipeline;
    this.name = String(Math.random());
  }

  apply(...args) {
    return this.pipeline.apply(this, ...args)
  }
}

/**
 * A multiple values (potentially huge) container.
 */
export class PCollection extends PValue {
  serialize() {
    let pb = new beam_runner_api_pb.PCollection();
    pb.setUniqueName(this.name); // 14Create/Impulse.None
    pb.setCoderId("TODO"); // ref_Coder_BytesCoder_1
    pb.setIsBounded(beam_runner_api_pb.IsBounded.Enum.BOUNDED);
    pb.setWindowingStrategyId("TODO"); // ref_Windowing_Windowing_1
    return pb;
  }
}