import { PTransform, Pipeline } from '../transforms';
import { PipelineOptions } from '../pipeline/pipeline-options';
import { PValue } from '../pcollection';
import { AppliedPTransform } from '../pipeline/applied-ptransform';

/**
 * A runner of a pipeline object.

  The base runner provides a run() method for visiting every node in the
  pipeline's DAG and executing the transforms computing the PValue in the node.

  A custom runner will typically provide implementations for some of the
  transform methods (ParDo, GroupByKey, Create, etc.). It may also
  provide a new implementation for clear_pvalue(), which is used to wipe out
  materialized values in order to reduce footprint.
 */
export class PipelineRunner {

  /**
   * Run the given transform or callable with this runner.
   * Can be await'ed to wait until completion.
   * @param {PTransform} transform PTransform to run
   * @param {PipelineOptions} options Pipeline options
   */
  async run(transform: PTransform | Pipeline, options: PipelineOptions) {
    const p = new Pipeline(this, options);
    if (transform instanceof PTransform) {
      p.apply(transform);
    }
    return p.run();
  }

  /**
   * Runs the entire pipeline.
   * @param {Pipeline} pipeline Pipeline to run
   * @param {PipelineOptions} options Pipeline options 
   */
  async runPipeline(_pipeline: Pipeline, _options?: PipelineOptions) {
    throw new Error("Subclasses should implement this method");
  }

  /**
   * Runner callback for a pipeline.apply call. Implementors may want
   * to override this method to create custom apply behavior for different
   * types of transforms.
   * @param {PTransform} transform PTransform to apply
   * @param {PValue} input Input for the PTransform
   * @param {PipelineOptions} options Pipeline options
   */
  apply(transform: PTransform, input?: PValue, _options?: PipelineOptions) {
    return transform.expand(input);
  }

  async runTransform(_transformNode: AppliedPTransform, _options?: PipelineOptions) {
    throw new Error("should be implemented in subclasses");
  }

}