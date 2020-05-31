import { Pipeline } from '../pipeline';
import { PTransform } from '../transforms';


/**
 * Base class for PCollection.
 */
export class PValue {
  pipeline: Pipeline;
  ref: string;
  
  constructor(pipeline: Pipeline) {
    this.pipeline = pipeline;
    this.ref = pipeline.context.createUniqueRef(this);
  }

  /**
   * Applies a transform or callable to a PValue.

    The method will insert the pvalue as the argument for pvalueish, then
    call the pipeline.apply() method with this modified argument list.
   * @param opts 
   */
  apply({transform, label}: {transform: PTransform, label?: string}) {
    return this.pipeline.apply({transform, label, pvalueish: this});
  }

  serialize(): any {
    return null;
    // throw new Error("Should be implemented by PCollection");
  }
}

/**
 * Marks the beginning of a pipeline.
 */
export class PBegin extends PValue {
  
}
