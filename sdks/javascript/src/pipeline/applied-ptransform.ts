import beam_runner_api_pb from '../model/generated/beam_runner_api_pb'
import { PTransform } from '../transforms/ptransform'
import { PValue } from '../pcollection/pvalue';

/*
 * A transform node representing an instance of applying a PTransform
 * (used internally by Pipeline for bookkeeping purposes).
 */
export class AppliedPTransform {
  parent?: AppliedPTransform;
  transform?: PTransform;
  fullLabel: string;
  inputs: PValue[];
  outputs: PValue[] = [];
  parts: AppliedPTransform[] = [];

  constructor(parent: AppliedPTransform | undefined, transform: PTransform | undefined, fullLabel: string, inputs: PValue[]) {
    this.parent = parent;
    this.transform = transform;
    this.fullLabel = fullLabel;
    this.inputs = inputs;
  }

  addPart(part: AppliedPTransform) {
    this.parts.push(part);
  }

  addOutput(output: PValue) {
    this.outputs.push(output);
  }

  serialize() {
    const transform = new beam_runner_api_pb.PTransform();
    transform.setUniqueName(this.fullLabel);
    if (this.transform) {
      transform.setSpec(this.transform.serialize());
      for (let i in this.inputs) {
        transform.getInputsMap().set(i, this.inputs[i].name);
      }
      for (let i in this.outputs) {
        // TODO: handle multiple outputs
        transform.getOutputsMap().set("None", this.outputs[i].name);
      }
      // TODO:
      // setInputs
      // setOutputs
    } else {
      // is root transform
    }
    transform.setSubtransformsList(this.parts.map(part => part.fullLabel));
    return transform;
  }
}