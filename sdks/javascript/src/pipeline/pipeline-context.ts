import { AppliedPTransform } from './applied-ptransform';
import { PCollection } from '../pcollection';

export class PipelineContext {
  counter: number = 0;
  namespace: string = "ref";

  transforms: {[x: string]: AppliedPTransform} = {};

  pcollections: {[x: string]: PCollection} = {};

  // TODO:
  // windowing_strategies
  // coders
  // environments
  
  /**
   * Create a unique ref for use within a pipeline.
   */
  createUniqueRef(object: Object, label?: string) {
    this.counter++;
    const ref = [this.namespace, object.constructor.name, label || object.constructor.name, this.counter].join("_");
    if (object instanceof AppliedPTransform) {
      this.transforms[ref] = object;
    } else if (object instanceof PCollection) {
      this.pcollections[ref] = object;
    }
    // TODO: other instances.
    return ref;
  }
}