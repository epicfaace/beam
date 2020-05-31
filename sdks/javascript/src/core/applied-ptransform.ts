import beam_runner_api_pb from '../model/generated/beam_runner_api_pb'
import { PTransform } from '../transforms/ptransform'
import { PValue } from "pcollection";

/*
 * A transform node representing an instance of applying a PTransform
 * (used internally by Pipeline for bookkeeping purposes).
 */
export class AppliedPTransform {
  // TODO: should inputs be PBegin | PCollection ?
  parent?: AppliedPTransform;
  transform?: PTransform;
  fullLabel: string;
  inputs: PValue[];
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

  serialize() {
    const transform = new beam_runner_api_pb.PTransform();
    transform.setUniqueName(this.fullLabel);
    if (this.transform) {
      transform.setSpec(this.transform.serialize());
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