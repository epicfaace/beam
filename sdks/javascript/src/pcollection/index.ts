import beam_runner_api_pb from "../model/generated/beam_runner_api_pb";
import { PValue } from './pvalue';

/**
 * A multiple values (potentially huge) container.
 */
export class PCollection extends PValue {
  bounded = true;
  tag = "None";
  
  serialize() {
    let pb = new beam_runner_api_pb.PCollection();
    pb.setUniqueName(this.ref); // 14Create/Impulse.None
    pb.setCoderId("TODO"); // ref_Coder_BytesCoder_1
    pb.setIsBounded(beam_runner_api_pb.IsBounded.Enum.BOUNDED);
    pb.setWindowingStrategyId("TODO"); // ref_Windowing_Windowing_1
    return pb;
  }
}