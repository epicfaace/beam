import beam_runner_api_pb from '../model/generated/beam_runner_api_pb'
import { PTransform } from '../transforms/ptransform'
import { PValue, PBegin } from '../pcollection/pvalue'
import { PipelineContext } from './pipeline-context';
import { AppliedPTransform } from './applied-ptransform';
import { PipelineOptions } from './pipeline-options';
import { PipelineRunner } from '../runner/pipeline-runner';
import { DirectRunner } from '../runner/direct-runner';

export type PValueish = PValue | Pipeline

export class Pipeline {
  /** Steps for this pipeline. */
  transformsStack: AppliedPTransform[] = [];

  /** Set of transform labels applied to the pipeline. */
  appliedLabels: Set<string> = new Set();

  /** Pipeline context -- used for generating unique refs. */
  context: PipelineContext = new PipelineContext();

  /** Pipeline options */
  options: PipelineOptions;

  /** Pipeline runner */
  runner: PipelineRunner;

  constructor(runner?: PipelineRunner, options?: PipelineOptions) {
    this.runner = runner || new DirectRunner();;
    this.options = options || new PipelineOptions();

    const rootTransform = new AppliedPTransform(undefined, new PTransform(), "", []);
    rootTransform.fullLabel = this.context.createUniqueRef(rootTransform);
    this.transformsStack.push(rootTransform);
  }

  _currentTransform() {
    return this.transformsStack[this.transformsStack.length - 1];
  }

  _rootTransform() {
    return this.transformsStack[0];
  }

  begin() {
    return this.apply({ transform: new PTransform(), pvalueish: new PBegin(this)})
  }

  /**
   * Add a step to the pipeline.
   * @param {PTransform} PTransform.
   * @param {string} Label of the PTransform.
   * @param {PValue} Input for the PTransform, typically a PCollection.
   * @returns {Pipeline_} Serialized pipeline proto
   */
  apply({transform, label, pvalueish}: {transform: PTransform, label?: string, pvalueish?: PValueish}) {
    const fullLabel = this.context.createUniqueRef(this._currentTransform(), label);
    if (this.appliedLabels.has(fullLabel)) {
      throw new Error("label is already in use");
    }
    const inputs = transform.extractInputPValues(pvalueish);
    const appliedPTransform = new AppliedPTransform(this._currentTransform(), transform, fullLabel, inputs);

    this.appliedLabels.add(fullLabel);
    this._currentTransform().addPart(appliedPTransform);
    this.transformsStack.push(appliedPTransform);

    const pvalueResult = this.runner.apply({
      transform,
      pvalueish: pvalueish || this,
      options: this.options
    });

    appliedPTransform.addOutput(pvalueResult);

    return pvalueResult;
  }

  /**
   * Serializes this pipeline to a runner api proto.
   * @returns {Pipeline_} Serialized pipeline proto
   */
  serialize() {
    const pipeline = new beam_runner_api_pb.Pipeline();

    const components = new beam_runner_api_pb.Components();
    for (let transform of this.transformsStack) {
      components.getTransformsMap().set(transform.fullLabel, transform.serialize());
    }
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

  /**
   * Runs this pipeline.
   */
  async run() {
    return this.runner.runPipeline(this, this.options);
  }
}
