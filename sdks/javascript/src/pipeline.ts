import beam_runner_api_pb from './model/generated/beam_runner_api_pb'
import { PTransform } from 'transforms/ptransform'
import { PValue } from 'pcollection'


// TODO: support step names.

export type PValueish = PValue | Pipeline

/*
 * A transform node representing an instance of applying a PTransform
 * (used internally by Pipeline for bookkeeping purposes).
 */
class AppliedPTransform {
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

export class Pipeline {
  /** Steps for this pipeline. */
  transformsStack: AppliedPTransform[] = [new AppliedPTransform(undefined, undefined, "", [])]

  /** Set of transform labels applied to the pipeline. */
  appliedLabels: Set<string> = new Set();

  constructor(_props?: any) {
    // TODO: add pipelineoptions
    // TODO: CallableWrapperDOFn for map and flatmap
  }

  _currentTransform() {
    return this.transformsStack[this.transformsStack.length - 1];
  }

  _rootTransform() {
    return this.transformsStack[0];
  }

  /**
   * Add a step to the pipeline.
   * @param {PTransform} PTransform.
   * @param {string} Label of the PTransform.
   * @param {PValue} Input for the PTransform, typically a PCollection.
   * @returns {Pipeline_} Serialized pipeline proto
   */
  apply(transform: PTransform, label?: string, pvalueish?: PValueish) {
    const fullLabel = this._currentTransform().fullLabel + "_" + (label || String(Math.random));
    if (this.appliedLabels.has(fullLabel)) {
      throw new Error("label is already in use");
    }
    const inputs = transform.extractInputPValues(pvalueish);
    const appliedPTransform = new AppliedPTransform(this._currentTransform(), transform, fullLabel, inputs);

    this.appliedLabels.add(fullLabel);
    this._currentTransform().addPart(appliedPTransform);
    this.transformsStack.push(appliedPTransform)
    return this;
  }

  /**
   * Serializes this pipeline to a runner api proto.
   * @returns {Pipeline_} Serialized pipeline proto
   */
  serialize() {
    const pipeline = new beam_runner_api_pb.Pipeline();
    
    const components = new beam_runner_api_pb.Components();
    components.getTransformsMap().set(this._rootTransform().fullLabel, this._rootTransform().serialize());
    pipeline.setComponents(components);
    pipeline.setRootTransformIdsList([this._rootTransform().fullLabel]);

    // StandardPTransforms.Primitives.MAP_WINDOWS
    return pipeline
  }

  /**
   * Clones this pipeline.
   * @returns {Pipeline} Cloned pipeline
   */
  clone() {
    const p = new Pipeline()
    // p._steps = [...this._steps]
    return p
  }

  /**
   * Builds this pipeline.
   * @returns {object} Object representing serialized pipeline
   */
  build() {
    return this.serialize().toObject()
  }
}
